import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import SftpClient from 'ssh2-sftp-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

dotenv.config({ path: path.join(root, '.env') });

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_PORT,
  FTP_REMOTE_PATH = '/public_html',
  FTP_SECURE = 'false',
  DEPLOY_PROTOCOL = 'ftp',
} = process.env;

function requireEnv(name, value) {
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env and fill in Namecheap credentials.`);
    process.exit(1);
  }
}

async function collectFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, base)));
    } else {
      files.push({
        local: fullPath,
        remote: path.posix.join('/', path.relative(base, fullPath).split(path.sep).join('/')),
      });
    }
  }

  return files;
}

async function deployFtp(files, remoteRoot) {
  const port = Number(FTP_PORT || 21);
  const client = new Client(60000);
  client.ftp.verbose = process.env.FTP_VERBOSE === 'true';

  console.log(`Connecting via FTP to ${FTP_HOST}:${port}…`);

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port,
      secure: FTP_SECURE === 'true',
    });

    await client.ensureDir(remoteRoot);
    await client.cd(remoteRoot);

    for (const file of files) {
      const remoteDir = path.posix.dirname(file.remote);
      if (remoteDir && remoteDir !== '.') {
        await client.ensureDir(remoteDir);
      }
      await client.uploadFrom(file.local, file.remote.replace(/^\//, ''));
      console.log(`  ↑ ${file.remote.replace(/^\//, '')}`);
    }
  } finally {
    client.close();
  }
}

async function deploySftp(files, remoteRoot) {
  const port = Number(FTP_PORT || 21098);
  const sftp = new SftpClient();

  console.log(`Connecting via SFTP to ${FTP_HOST}:${port}…`);

  try {
    await sftp.connect({
      host: FTP_HOST,
      port,
      username: FTP_USER,
      password: FTP_PASSWORD,
    });

    for (const file of files) {
      const remotePath = path.posix.join(remoteRoot, file.remote.replace(/^\//, ''));
      const remoteDir = path.posix.dirname(remotePath);
      await sftp.mkdir(remoteDir, true);
      await sftp.put(file.local, remotePath);
      console.log(`  ↑ ${file.remote.replace(/^\//, '')}`);
    }
  } finally {
    await sftp.end();
  }
}

async function main() {
  requireEnv('FTP_HOST', FTP_HOST);
  requireEnv('FTP_USER', FTP_USER);
  requireEnv('FTP_PASSWORD', FTP_PASSWORD);

  try {
    await access(distDir);
  } catch {
    console.error('dist/ not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = await collectFiles(distDir);
  const remoteRoot = FTP_REMOTE_PATH.replace(/\/$/, '') || '/';

  console.log(`Uploading ${files.length} files to ${remoteRoot}…`);

  if (DEPLOY_PROTOCOL === 'sftp') {
    await deploySftp(files, remoteRoot);
  } else {
    await deployFtp(files, remoteRoot);
  }

  console.log('Deploy complete.');
}

main().catch((err) => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});

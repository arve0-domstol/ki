'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, execSync } = require('node:child_process');

// ── Configuration ────────────────────────────────────────────────────────────

const PORT = 4000;
const POLL_INTERVAL_MS = 10_000;
const SOURCE_REPO = 'domstolene/lovisa_core';
const SOURCE_REMOTE = 'scoreboard_lovisa_core';
const SOURCE_BASE_BRANCH = 'ki';
const EXCLUDED_USERS = ['arve0'];
const MAX_MODULE = process.env.MAX_MODULE ? Number(process.env.MAX_MODULE) : 7;

const repoRoot = path.resolve(__dirname, '..');
const worktreesDir = path.join(__dirname, 'worktrees');

// ── State ────────────────────────────────────────────────────────────────────

/** @type {{ participants: Record<string, { login: string, avatarUrl: string, branchName: string, completedModules: number[], lastChecked: string }> }} */
const state = { participants: {} };

/** Runtime-excluded logins (in addition to EXCLUDED_USERS). Persists in memory only. */
const dynamicExcluded = new Set();

function isExcluded(login) {
  const normalizedLogin = login.toLowerCase();
  return EXCLUDED_USERS.some(user => {
    const normalizedUser = user.toLowerCase();
    return normalizedLogin === normalizedUser || normalizedLogin.startsWith(`${normalizedUser}-`);
  }) || dynamicExcluded.has(login);
}

// ── SSE clients ──────────────────────────────────────────────────────────────

const sseClients = new Set();

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    res.write(msg);
  }
}

// ── Git helpers ──────────────────────────────────────────────────────────────

function git(args, opts = {}) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', ...opts }).trim();
}

function gitInWorktree(login, args) {
  const wtDir = path.join(worktreesDir, login);
  return execFileSync('git', args, { cwd: wtDir, encoding: 'utf8' }).trim();
}

function ensureSourceRemote() {
  try {
    git(['remote', 'get-url', SOURCE_REMOTE]);
  } catch {
    git(['remote', 'add', SOURCE_REMOTE, `https://github.com/${SOURCE_REPO}.git`]);
    return;
  }
  git(['remote', 'set-url', SOURCE_REMOTE, `https://github.com/${SOURCE_REPO}.git`]);
}

function branchNameFor(login) {
  return `ki-${login}`;
}

function fetchParticipantBranches(login) {
  const participantBranch = branchNameFor(login);
  git([
    'fetch', '--depth=50', SOURCE_REMOTE,
    `+refs/heads/${SOURCE_BASE_BRANCH}:refs/remotes/${SOURCE_REMOTE}/${SOURCE_BASE_BRANCH}`,
    `+refs/heads/${participantBranch}:refs/remotes/${SOURCE_REMOTE}/${participantBranch}`,
  ]);
}

function initWorktree(login) {
  const wtDir = path.join(worktreesDir, login);
  ensureSourceRemote();
  fetchParticipantBranches(login);
  if (!fs.existsSync(wtDir)) {
    git(['worktree', 'add', '--detach', `scoreboard/worktrees/${login}`, `refs/remotes/${SOURCE_REMOTE}/${branchNameFor(login)}`]);
    console.log(`[init] worktree created for ${login}`);
  } else {
    syncWorktree(login);
  }
}

function syncWorktree(login) {
  ensureSourceRemote();
  fetchParticipantBranches(login);
  gitInWorktree(login, ['reset', '--hard', `refs/remotes/${SOURCE_REMOTE}/${branchNameFor(login)}`]);
}

// ── Module detection ─────────────────────────────────────────────────────────

function wtPath(login, relPath) {
  return path.join(worktreesDir, login, relPath);
}

function fileExists(login, relPath) {
  return fs.existsSync(wtPath(login, relPath));
}

function hasLogFile(login) {
  try {
    return fs.readdirSync(wtPath(login, '.')).some(name => /^feil-.+-.+\.txt$/i.test(name));
  } catch {
    return false;
  }
}

function commitMessageContains(login, filePath, keywords) {
  try {
    const log = git(
      [
        'log', '--oneline', '-20',
        `refs/remotes/${SOURCE_REMOTE}/${branchNameFor(login)}`,
        `^refs/remotes/${SOURCE_REMOTE}/${SOURCE_BASE_BRANCH}`,
        '--', filePath,
      ],
      { cwd: repoRoot },
    ).toLowerCase();
    return keywords.some(k => log.includes(k.toLowerCase()));
  } catch {
    return false;
  }
}

/**
 * Returns array of completed module numbers for the given participant.
 * Only modules with detectors implemented here are checked.
 */
function detectCompletedModules(login) {
  const completed = [];

  // Module 01 – sammendrag.md exists OR commit message contains "virker"
  if (MAX_MODULE >= 1 && (
    fileExists(login, 'sammendrag.md') ||
    commitMessageContains(login, '.', ['virker'])
  )) {
    completed.push(1);
  }

  // Module 02 – lovisa-web.md exists OR commit message
  if (MAX_MODULE >= 2 && (
    fileExists(login, 'products/lovisa-web/lovisa-web.md') ||
    fileExists(login, 'lovisa-web.md') ||
    commitMessageContains(login, ':(glob)**/lovisa-web.md', ['utforske', 'kodebase', 'teknologi'])
  )) {
    completed.push(2);
  }

  // Module 03 – drizzle.md exists OR commit message
  if (MAX_MODULE >= 3 && (
    fileExists(login, 'products/lovisa-web/drizzle.md') ||
    fileExists(login, 'drizzle.md') ||
    commitMessageContains(login, ':(glob)**/drizzle.md', ['kontekst', 'drizzle'])
  )) {
    completed.push(3);
  }

  // Module 04 – testpersoner instructions or implementation commit
  if (MAX_MODULE >= 4 && (
    fileExists(login, 'products/testpersoner/AGENTS.md') ||
    commitMessageContains(login, 'products/testpersoner/', ['tilfeldig', 'tilfeldig person', 'random'])
  )) {
    completed.push(4);
  }

  // Module 05 – saved production log analysis
  if (MAX_MODULE >= 5 && (
    hasLogFile(login) ||
    commitMessageContains(login, '.', ['analyserer rene logger', 'stack traces', 'logganalyse'])
  )) {
    completed.push(5);
  }

  // Module 06 – grill-me skill or login-help implementation plan
  if (MAX_MODULE >= 6 && (
    fileExists(login, '.agents/skills/grill-me/SKILL.md') ||
    commitMessageContains(login, '.', ['grill', 'skill']) ||
    fileExists(login, 'innlogging-testbrukere.md') ||
    fileExists(login, 'products/lovisa-web/innlogging-testbrukere.md')
  )) {
    completed.push(6);
  }

  // Module 07 – the explicit commit follows the Playwright login-test update
  if (MAX_MODULE >= 7 && (
    commitMessageContains(login, '.', ['detaljer for testingen', 'testingen av implementasjonen'])
  )) {
    completed.push(7);
  }

  return completed;
}

// ── GitHub auth ───────────────────────────────────────────────────────────────

let _githubToken = null;

function getGitHubToken() {
  if (_githubToken) return _githubToken;
  // Try GH_TOKEN / GITHUB_TOKEN env var first
  if (process.env.GH_TOKEN) return (_githubToken = process.env.GH_TOKEN);
  if (process.env.GITHUB_TOKEN) return (_githubToken = process.env.GITHUB_TOKEN);
  // Try gh CLI
  try {
    const t = execSync('gh auth token', { encoding: 'utf8' }).trim();
    if (t) return (_githubToken = t);
  } catch {}
  // Fall back to git credential helper
  try {
    const out = execSync(
      'printf "host=github.com\\nprotocol=https\\n\\n" | git credential fill',
      { encoding: 'utf8', shell: '/bin/sh' }
    );
    const m = out.match(/password=(.+)/);
    if (m) return (_githubToken = m[1].trim());
  } catch {}
  throw new Error('No GitHub auth found. Set GH_TOKEN env var or run: gh auth login');
}

// ── Participant discovery ────────────────────────────────────────────────────

function fetchParticipants() {
  const token = getGitHubToken();
  const participants = [];
  for (let page = 1; ; page++) {
    const raw = execFileSync('curl', [
      '--fail', '--silent', '--show-error',
      '-H', `Authorization: Bearer ${token}`,
      '-H', 'Accept: application/vnd.github+json',
      `https://api.github.com/repos/${SOURCE_REPO}/branches?per_page=100&page=${page}`,
    ], { encoding: 'utf8' });
    const branches = JSON.parse(raw);
    if (!Array.isArray(branches)) {
      throw new Error(`GitHub API error: ${JSON.stringify(branches)}`);
    }
    for (const branch of branches) {
      if (!branch.name.startsWith('ki-')) continue;
      const login = branch.name.slice('ki-'.length);
      if (!/^[A-Za-z0-9-]+$/.test(login) || isExcluded(login)) continue;
      participants.push({
        login,
        branchName: branch.name,
        avatarUrl: `https://github.com/${login}.png`,
      });
    }
    if (branches.length < 100) break;
  }
  return participants;
}

// ── Main loop ────────────────────────────────────────────────────────────────

async function mainLoop() {
  while (true) {
    try {
      const discoveredParticipants = fetchParticipants();
      console.log(`[loop] ${discoveredParticipants.length} participant branch(es) found`);

      for (const participant of discoveredParticipants) {
        const { login, avatarUrl, branchName } = participant;
        try {
          if (isExcluded(login)) continue;
          if (!state.participants[login]) {
            initWorktree(login);
            state.participants[login] = {
              login,
              avatarUrl,
              branchName,
              completedModules: [],
              lastChecked: new Date().toISOString(),
            };
            console.log(`[participant] new: ${login}`);
            broadcast('fork', { login, avatarUrl, branchName });
          } else {
            state.participants[login].branchName = branchName;
            state.participants[login].avatarUrl = avatarUrl;
            syncWorktree(login);
          }
        } catch (err) {
          console.warn(`[warn] ${login}: ${err.message}`);
        }
      }

      for (const login of Object.keys(state.participants)) {
        try {
          const prev = [...state.participants[login].completedModules];
          const now = detectCompletedModules(login);
          state.participants[login].completedModules = now;
          state.participants[login].lastChecked = new Date().toISOString();

          const newModules = now.filter(m => !prev.includes(m));
          for (const mod of newModules) {
            console.log(`[progress] ${login} completed module ${mod}`);
            broadcast('progress', { login, module: mod });
          }
        } catch (err) {
          console.warn(`[warn] detect ${login}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`[error] loop: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────────

const publicDir = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // SSE endpoint
  if (url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(':\n\n'); // keep-alive comment
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // State endpoint
  if (url.pathname === '/state') {
    const body = JSON.stringify({ ...state, excluded: [...dynamicExcluded] });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(body);
    return;
  }

  // Exclude endpoint: POST /exclude  { login }
  if (url.pathname === '/exclude' && req.method === 'POST') {
    let body = '';
    req.on('data', d => { body += d; });
    req.on('end', () => {
      try {
        const { login } = JSON.parse(body);
        if (!login || typeof login !== 'string') throw new Error('missing login');
        dynamicExcluded.add(login);
        delete state.participants[login];
        broadcast('excluded', { login });
        console.log(`[exclude] ${login}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400);
        res.end(err.message);
      }
    });
    return;
  }

  // Un-exclude endpoint: DELETE /exclude/{login}
  if (url.pathname.startsWith('/exclude/') && req.method === 'DELETE') {
    const login = decodeURIComponent(url.pathname.slice('/exclude/'.length));
    dynamicExcluded.delete(login);
    // Re-sync the user immediately so they appear in state again
    try {
      if (!state.participants[login]) {
        const participant = fetchParticipants().find(p => p.login === login);
        if (participant) {
          state.participants[login] = {
            login,
            avatarUrl: participant.avatarUrl,
            branchName: participant.branchName,
            completedModules: [],
            lastChecked: new Date().toISOString(),
          };
          initWorktree(login);
        }
      }
      if (state.participants[login]) {
        state.participants[login].completedModules = detectCompletedModules(login);
        state.participants[login].lastChecked = new Date().toISOString();
      }
    } catch (err) {
      console.warn(`[unexclude] re-sync failed for ${login}: ${err.message}`);
    }
    broadcast('unexcluded', { login });
    console.log(`[unexclude] ${login}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Static files
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  filePath = path.join(publicDir, filePath);

  // Security: prevent path traversal
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Scoreboard running at http://localhost:${PORT}`);
  console.log('[init] Venter 10 sekunder før fork-polling starter…');
  setTimeout(mainLoop, 3_000);
});

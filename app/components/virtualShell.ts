export type VirtualFile = {
  type: 'file';
  content: string;
};

export type VirtualDirectory = {
  type: 'directory';
  children: Record<string, VirtualNode>;
};

export type VirtualNode = VirtualFile | VirtualDirectory;
export type OutputKind = 'normal' | 'success' | 'warning' | 'error';

export type ShellContext = {
  root: VirtualDirectory;
  cwd: string;
  previousDirectory: string;
  history: string[];
  startedAt: number;
};

export type ShellResult = {
  output: string;
  kind?: OutputKind;
  clear?: boolean;
  cwd?: string;
  previousDirectory?: string;
};

export const shellCommands = [
  'pwd', 'ls', 'cd', 'tree', 'mkdir', 'touch', 'cat', 'echo', 'cp', 'mv',
  'rm', 'whoami', 'hostname', 'uname', 'date', 'uptime', 'clear', 'history',
  'help', 'git', 'python', 'node', 'npm', 'neofetch', 'about', 'skills',
  'projects', 'experience', 'education', 'contact', 'social', 'resume', 'exit',
];

const home = '/home/issam';

function directory(children: Record<string, VirtualNode> = {}): VirtualDirectory {
  const safeChildren = Object.create(null) as Record<string, VirtualNode>;
  Object.entries(children).forEach(([name, child]) => {
    safeChildren[name] = child;
  });
  return { type: 'directory', children: safeChildren };
}

function file(content = ''): VirtualFile {
  return { type: 'file', content };
}

export function createShellContext(): ShellContext {
  const portfolio = directory({
    'README.md': file('# Issam Oubenazha\nFull Stack Developer and AI & Data Scientist.\n'),
    'about.txt': file('I build scalable, user-friendly web and AI-driven solutions.\n'),
    'skills.txt': file('Frontend, backend, databases, AI, cybersecurity, and REST APIs.\n'),
  });
  const root = directory({
    home: directory({
      issam: directory({
        Desktop: directory(),
        Documents: directory(),
        Downloads: directory(),
        Projects: directory(),
        portfolio,
      }),
    }),
    etc: directory({
      hostname: file('portfolio\n'),
      'os-release': file('NAME="Portfolio Virtual Environment"\n'),
    }),
    usr: directory({ bin: directory() }),
    var: directory({ log: directory() }),
    tmp: directory(),
  });

  return { root, cwd: home, previousDirectory: home, history: [], startedAt: Date.now() };
}

export function splitCommands(input: string): string[] {
  const commands: string[] = [];
  let current = '';
  let quote = '';
  let escaped = false;

  for (const character of input) {
    if (escaped) {
      current += character;
      escaped = false;
    } else if (character === '\\' && quote !== "'") {
      current += character;
      escaped = true;
    } else if (quote) {
      current += character;
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") {
      current += character;
      quote = character;
    } else if (character === ';') {
      if (current.trim()) commands.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  if (current.trim()) commands.push(current.trim());
  return commands;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let token = '';
  let quote = '';
  let escaped = false;
  let tokenStarted = false;

  for (const character of input) {
    if (escaped) {
      token += character;
      tokenStarted = true;
      escaped = false;
    } else if (character === '\\' && quote !== "'") {
      escaped = true;
      tokenStarted = true;
    } else if (quote) {
      if (character === quote) quote = '';
      else token += character;
      tokenStarted = true;
    } else if (character === '"' || character === "'") {
      quote = character;
      tokenStarted = true;
    } else if (/\s/.test(character)) {
      if (tokenStarted) tokens.push(token);
      token = '';
      tokenStarted = false;
    } else {
      token += character;
      tokenStarted = true;
    }
  }

  if (escaped || quote) throw new Error('Unclosed quote or escape in command.');
  if (tokenStarted) tokens.push(token);
  return tokens;
}

function normalizePath(path: string, cwd: string): string {
  const expanded = path === '~' ? home
    : path.startsWith('~/') ? `${home}/${path.slice(2)}`
      : path;
  const parts = (expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`).split('/');
  const normalized: string[] = [];

  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') normalized.pop();
    else normalized.push(part);
  }

  return `/${normalized.join('/')}`;
}

function findNode(root: VirtualDirectory, path: string): VirtualNode | undefined {
  let current: VirtualNode = root;
  for (const part of path.split('/').filter(Boolean)) {
    if (current.type !== 'directory') return undefined;
    current = current.children[part];
    if (!current) return undefined;
  }
  return current;
}

export function virtualPathExists(context: ShellContext, path: string): boolean {
  return findNode(context.root, normalizePath(path, context.cwd)) !== undefined;
}

function parentFor(root: VirtualDirectory, path: string): {
  parent: VirtualDirectory;
  name: string;
} | undefined {
  const separator = path.lastIndexOf('/');
  const parentPath = separator === 0 ? '/' : path.slice(0, separator);
  const name = path.slice(separator + 1);
  const parent = findNode(root, parentPath || '/');
  if (!name || parent?.type !== 'directory') return undefined;
  return { parent, name };
}

function displayPath(path: string, cwd: string): string {
  if (path === cwd) return '.';
  if (path.startsWith(`${cwd}/`)) return path.slice(cwd.length + 1);
  return path;
}

function copyNode(node: VirtualNode): VirtualNode {
  if (node.type === 'file') return file(node.content);
  return directory(Object.fromEntries(
    Object.entries(node.children).map(([name, child]) => [name, copyNode(child)]),
  ));
}

function listDirectory(node: VirtualDirectory, long: boolean, all: boolean): string {
  const names = Object.keys(node.children).sort((a, b) => a.localeCompare(b));
  const rows = all ? ['.', '..', ...names] : names;
  if (!rows.length) return 'This directory is empty.';
  if (!long) return rows.map((name) =>
    name !== '.' && name !== '..' && node.children[name]?.type === 'directory'
      ? `${name}/`
      : name,
  ).join('    ');

  return rows.map((name) => {
    const child = node.children[name];
    const isDirectory = name === '.' || name === '..' || child?.type === 'directory';
    const permissions = isDirectory ? 'drwxr-xr-x' : '-rw-r--r--';
    const renderedName = isDirectory && name !== '.' && name !== '..' ? `${name}/` : name;
    return `${permissions}  1 issam issam  ${String(child?.type === 'file' ? child.content.length : 0).padStart(4)}  ${renderedName}`;
  }).join('\n');
}

function insertFile(context: ShellContext, path: string, content: string, append: boolean): string | undefined {
  const targetPath = normalizePath(path, context.cwd);
  const location = parentFor(context.root, targetPath);
  if (!location) return `bash: ${path}: parent directory does not exist`;
  const existing = location.parent.children[location.name];
  if (existing?.type === 'directory') return `bash: ${path}: is a directory`;
  location.parent.children[location.name] = file(
    append && existing?.type === 'file' ? existing.content + content : content,
  );
  return undefined;
}

function isWithin(path: string, directoryPath: string): boolean {
  return path === directoryPath || path.startsWith(`${directoryPath}/`);
}

function closestCommand(command: string): string | undefined {
  const distance = (left: string, right: string) => {
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= right.length; j += 1) {
        const above = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1));
        previous = above;
      }
    }
    return row[right.length];
  };
  const candidate = [...new Set(shellCommands)].sort((a, b) => distance(command, a) - distance(command, b))[0];
  return candidate && distance(command, candidate) <= Math.max(1, Math.floor(command.length / 3))
    ? candidate
    : undefined;
}

function error(output: string): ShellResult {
  return { output, kind: 'error' };
}

export function runVirtualCommand(input: string, context: ShellContext): ShellResult {
  let tokens: string[];
  try {
    tokens = tokenize(input);
  } catch (reason) {
    return error(reason instanceof Error ? reason.message : 'Unable to parse command.');
  }
  if (!tokens.length) return { output: '' };
  const [command, ...args] = tokens;
  const resolve = (path: string) => normalizePath(path, context.cwd);

  switch (command) {
    case 'pwd':
      return { output: context.cwd };
    case 'ls': {
      let long = false;
      let all = false;
      const paths: string[] = [];
      for (const arg of args) {
        if (arg.startsWith('-')) {
          if (/^-[a-zA-Z]+$/.test(arg) && [...arg.slice(1)].every((flag) => 'la'.includes(flag))) {
            long ||= arg.includes('l');
            all ||= arg.includes('a');
          } else return error(`ls: invalid option -- '${arg.slice(1) || '-'}'`);
        } else paths.push(arg);
      }
      const path = resolve(paths[0] || context.cwd);
      const node = findNode(context.root, path);
      if (!node) return error(`ls: cannot access '${paths[0] || path}': No such file or directory`);
      if (node.type === 'file') return { output: displayPath(path, context.cwd) };
      return { output: listDirectory(node, long, all) };
    }
    case 'cd': {
      if (args.length > 1) return error('cd: too many arguments');
      const target = args[0] === '-' ? context.previousDirectory : resolve(args[0] || home);
      const node = findNode(context.root, target);
      if (!node) return error(`cd: ${args[0] || target}: No such file or directory`);
      if (node.type !== 'directory') return error(`cd: ${args[0] || target}: Not a directory`);
      return { output: args[0] === '-' ? target : '', cwd: target, previousDirectory: context.cwd };
    }
    case 'tree': {
      const target = resolve(args.find((arg) => !arg.startsWith('-')) || context.cwd);
      const node = findNode(context.root, target);
      if (!node) return error(`tree: '${target}': No such file or directory`);
      if (node.type === 'file') return { output: target };
      const lines = [target === '/' ? '/' : target.split('/').pop() || '/'];
      const walk = (directoryNode: VirtualDirectory, prefix: string, depth: number) => {
        if (depth >= 5) return;
        const names = Object.keys(directoryNode.children).sort((a, b) => a.localeCompare(b));
        names.forEach((name, index) => {
          const last = index === names.length - 1;
          const child = directoryNode.children[name];
          lines.push(`${prefix}${last ? '└── ' : '├── '}${name}${child.type === 'directory' ? '/' : ''}`);
          if (child.type === 'directory') walk(child, `${prefix}${last ? '    ' : '│   '}`, depth + 1);
        });
      };
      walk(node, '', 0);
      return { output: lines.join('\n') };
    }
    case 'mkdir': {
      const recursive = args.includes('-p');
      const paths = args.filter((arg) => arg !== '-p');
      if (!paths.length) return error('mkdir: missing operand');
      for (const inputPath of paths) {
        const path = resolve(inputPath);
        const existing = findNode(context.root, path);
        if (existing) {
          if (recursive && existing.type === 'directory') continue;
          return error(`mkdir: cannot create directory '${inputPath}': File exists`);
        }
        if (recursive) {
          let currentPath = '';
          for (const part of path.split('/').filter(Boolean)) {
            currentPath += `/${part}`;
            const parent = parentFor(context.root, currentPath);
            if (!parent) return error(`mkdir: cannot create directory '${inputPath}': No such file or directory`);
            if (!parent.parent.children[parent.name]) parent.parent.children[parent.name] = directory();
          }
        } else {
          const parent = parentFor(context.root, path);
          if (!parent) return error(`mkdir: cannot create directory '${inputPath}': No such file or directory`);
          parent.parent.children[parent.name] = directory();
        }
      }
      return { output: 'Directory created.', kind: 'success' };
    }
    case 'touch': {
      if (!args.length) return error('touch: missing file operand');
      for (const inputPath of args) {
        const path = resolve(inputPath);
        const existing = findNode(context.root, path);
        if (existing?.type === 'directory') return error(`touch: cannot touch '${inputPath}': Is a directory`);
        if (!existing) {
          const parent = parentFor(context.root, path);
          if (!parent) return error(`touch: cannot touch '${inputPath}': No such file or directory`);
          parent.parent.children[parent.name] = file();
        }
      }
      return { output: 'File ready.', kind: 'success' };
    }
    case 'cat': {
      if (!args.length) return error('cat: missing file operand');
      const output: string[] = [];
      for (const inputPath of args) {
        const node = findNode(context.root, resolve(inputPath));
        if (!node) return error(`cat: ${inputPath}: No such file or directory`);
        if (node.type === 'directory') return error(`cat: ${inputPath}: Is a directory`);
        output.push(node.content);
      }
      return { output: output.join('\n') };
    }
    case 'echo': {
      const redirectIndex = args.findIndex((arg) => arg === '>' || arg === '>>');
      if (redirectIndex === -1) return { output: args.join(' ') };
      if (redirectIndex + 1 >= args.length) return error('bash: syntax error near unexpected token `newline`');
      if (redirectIndex + 2 < args.length) return error('bash: ambiguous redirect');
      const writeError = insertFile(context, args[redirectIndex + 1], `${args.slice(0, redirectIndex).join(' ')}\n`, args[redirectIndex] === '>>');
      return writeError ? error(writeError) : { output: 'Text written to virtual file.', kind: 'success' };
    }
    case 'cp':
    case 'mv': {
      const recursive = args.includes('-r') || args.includes('-R');
      const paths = args.filter((arg) => !['-r', '-R', '-f', '-i'].includes(arg));
      if (paths.length < 2) return error(`${command}: missing file operand`);
      if (paths.length > 2) return error(`${command}: target must be a single path`);
      const sourcePath = resolve(paths[0]);
      const source = findNode(context.root, sourcePath);
      if (!source) return error(`${command}: cannot stat '${paths[0]}': No such file or directory`);
      if (source.type === 'directory' && !recursive) return error(`${command}: -r not specified; omitting directory '${paths[0]}'`);
      const requestedDestination = resolve(paths[1]);
      const existingDestination = findNode(context.root, requestedDestination);
      const destinationPath = existingDestination?.type === 'directory'
        ? `${requestedDestination === '/' ? '' : requestedDestination}/${sourcePath.split('/').pop()}`
        : requestedDestination;
      if (destinationPath === sourcePath || isWithin(destinationPath, sourcePath)) {
        return error(`${command}: cannot copy or move a directory into itself`);
      }
      const destination = parentFor(context.root, destinationPath);
      if (!destination) return error(`${command}: cannot create '${paths[1]}': No such file or directory`);
      if (destination.parent.children[destination.name]) return error(`${command}: '${paths[1]}' already exists`);
      if (command === 'mv' && isWithin(context.cwd, sourcePath)) {
        return error(`mv: cannot move '${paths[0]}' while it contains the current directory`);
      }
      destination.parent.children[destination.name] = command === 'cp' ? copyNode(source) : source;
      if (command === 'mv') {
        const sourceParent = parentFor(context.root, sourcePath);
        if (sourceParent) delete sourceParent.parent.children[sourceParent.name];
      }
      return { output: command === 'cp' ? 'Copied in virtual filesystem.' : 'Moved in virtual filesystem.', kind: 'success' };
    }
    case 'rm': {
      const recursive = args.includes('-r') || args.includes('-R');
      const force = args.includes('-f');
      const paths = args.filter((arg) => !['-r', '-R', '-f', '-i'].includes(arg));
      if (!paths.length) return error('rm: missing operand');
      for (const inputPath of paths) {
        const path = resolve(inputPath);
        if (path === '/' || isWithin(context.cwd, path)) return error(`rm: refusing to remove '${inputPath}': it contains the current directory or is the root`);
        const node = findNode(context.root, path);
        if (!node) {
          if (force) continue;
          return error(`rm: cannot remove '${inputPath}': No such file or directory`);
        }
        if (node.type === 'directory' && !recursive) return error(`rm: cannot remove '${inputPath}': Is a directory (use rm -r)`);
        const parent = parentFor(context.root, path);
        if (parent) delete parent.parent.children[parent.name];
      }
      return { output: 'Removed from virtual filesystem.', kind: 'success' };
    }
    case 'whoami':
      return { output: 'issam' };
    case 'hostname':
      return { output: 'portfolio' };
    case 'uname':
      return { output: args.includes('-a') ? 'Portfolio Virtual Environment portfolio 1.0.0 virtual x86_64 GNU/Linux' : 'Linux' };
    case 'date':
      return { output: new Date().toString() };
    case 'uptime': {
      const minutes = Math.floor((Date.now() - context.startedAt) / 60_000);
      return { output: `up ${minutes} min, 1 user, load average: 0.00, 0.00, 0.00` };
    }
    case 'clear':
      return { output: '', clear: true };
    case 'history':
      return { output: context.history.map((entry, index) => `${String(index + 1).padStart(4)}  ${entry}`).join('\n') || 'No commands in history yet.' };
    case 'git':
      if (args[0] === '--version' || args[0] === '-v') return { output: 'git version 2.43.0 (virtual shell)' };
      if (args[0] === 'status') return { output: 'On branch main\nYour working tree is clean.\n\nThis is a read-only portfolio preview; repository commands are simulated.', kind: 'warning' };
      if (args[0] === 'branch') return { output: '* main\n  portfolio-preview' };
      if (args[0] === 'log') return { output: 'commit 7f3a2c1 (HEAD -> main)\nAuthor: Issam Oubenazha\n    Portfolio preview snapshot' };
      return { output: 'git: try `git status`, `git branch`, `git log`, or `git --version` (read-only preview).' };
    case 'python':
      return { output: args.includes('--version') || args.includes('-V') ? 'Python 3.12.0 (virtual preview)' : 'Python is available as a version preview only; code execution is disabled in this isolated shell.', kind: 'warning' };
    case 'node':
      return { output: args.includes('--version') || args.includes('-v') ? 'v22.0.0 (virtual preview)' : 'Node.js is available as a version preview only; code execution is disabled in this isolated shell.', kind: 'warning' };
    case 'npm':
      if (args[0] === '--version' || args[0] === '-v') return { output: '10.5.0 (virtual preview)' };
      if (args[0] === 'list' || args[0] === 'ls') return { output: 'portfolio-preview@1.0.0\n└── (dependencies are not installed in the virtual shell)' };
      return { output: 'npm is a read-only preview here. Try `npm --version` or `npm list`.', kind: 'warning' };
    case 'neofetch':
      return {
        output: [
          '       .--.        issam@portfolio',
          '      |o_o |       ----------------',
          '      |:_/ |       OS: Portfolio Virtual Environment',
          '     //   \\\\       Shell: portfolio-shell 1.0',
          '    (|     | )      Terminal: web terminal',
          '   /\\_   _/`\\      Commands: ' + new Set(shellCommands).size + ' virtual commands',
          '   \\___)=(___/      Directory: ' + context.cwd,
        ].join('\n'),
      };
    case 'help':
      return { output: 'Navigation: pwd, ls [-la], cd, tree\nFiles: mkdir, touch, cat, echo, cp, mv, rm\nSystem: whoami, hostname, uname, date, uptime, clear, history\nDeveloper: git, python, node, npm, neofetch\nPortfolio: about, skills, projects, experience, education, contact, social, resume\n\nOnly the in-memory virtual filesystem is writable. Host commands and code execution are disabled. Use `command --help` where supported.' };
    default: {
      const suggestion = closestCommand(command);
      return error(`bash: ${command}: command not found${suggestion ? `\nDid you mean '${suggestion}'?` : '\nType `help` to see available commands.'}`);
    }
  }
}

export function completePath(input: string, context: ShellContext): string[] {
  const separator = input.lastIndexOf('/');
  const directoryInput = separator === -1 ? '.' : input.slice(0, separator) || '/';
  const prefix = separator === -1 ? input : input.slice(separator + 1);
  const directoryPath = normalizePath(directoryInput, context.cwd);
  const node = findNode(context.root, directoryPath);
  if (node?.type !== 'directory') return [];
  return Object.keys(node.children)
    .filter((name) => name.startsWith(prefix))
    .map((name) => `${separator === -1 ? '' : input.slice(0, separator + 1)}${name}${node.children[name].type === 'directory' ? '/' : ''}`);
}

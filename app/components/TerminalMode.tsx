'use client';

import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { projects } from '@/app/data/projects';
import {
  completePath,
  createShellContext,
  runVirtualCommand,
  shellCommands,
  splitCommands,
  type OutputKind,
  virtualPathExists,
} from './virtualShell';
import './TerminalMode.css';

type TerminalEntry = {
  id: number;
  command: string;
  prompt: string;
  output?: ReactNode;
  kind?: OutputKind;
};

type TerminalModeProps = {
  children: ReactNode;
};

const portfolioCommands = [
  ['about', 'About me'],
  ['skills', 'Technical skills'],
  ['projects', 'Portfolio projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['contact', 'Contact information'],
  ['social', 'Social profiles'],
  ['resume', 'Open my resume'],
];

function promptDirectory(path: string): string {
  if (path === '/home/issam') return '~';
  if (path.startsWith('/home/issam/')) return `~/${path.slice('/home/issam/'.length)}`;
  return path;
}

function terminalPrompt(path: string): string {
  return `issam@portfolio:${promptDirectory(path)}$`;
}

function renderShellOutput(output: string, command: string, entryId: number): ReactNode {
  const lines = output.split('\n');
  return lines.map((line, index) => {
    const directoryLine = /^ls(?:\s|$)/.test(command)
      ? line.replace(/(^|\s)([^\s]+\/)(?=\s|$)/g, '$1\u0000$2')
      : line.replace(/^(.*?)(\/)$/g, '$1\u0000$2');
    const chunks = directoryLine.split('\u0000');
    return (
      <span className="terminal-output-line" key={`${entryId}-${index}`}>
        {chunks.map((chunk, chunkIndex) => chunk.endsWith('/') && chunkIndex > 0
          ? <span className="terminal-directory" key={`${entryId}-${index}-${chunkIndex}`}>{chunk}</span>
          : chunk)}
        {index < lines.length - 1 && <br />}
      </span>
    );
  });
}

function PortfolioOutput({ name }: { name: string }): ReactNode {
  switch (name) {
    case 'help':
      return (
        <div className="terminal-help">
          <p className="terminal-muted">Portfolio shortcuts</p>
          {portfolioCommands.map(([command, description]) => (
            <div className="terminal-help-row" key={command}>
              <code>{command}</code><span aria-hidden="true">→</span><span>{description}</span>
            </div>
          ))}
          <p className="terminal-muted terminal-help-note">
            Type <code>help</code> for shell commands. Earlier <code>cd about</code>-style portfolio shortcuts still work.
          </p>
        </div>
      );
    case 'about':
      return (
        <div className="terminal-copy">
          <p className="terminal-heading">Issam Oubenazha</p>
          <p>Full Stack Developer and AI &amp; Data Scientist.</p>
          <p>I build scalable, user-friendly web and AI-driven solutions, with interests in AI, cybersecurity, and digital transformation.</p>
        </div>
      );
    case 'projects':
      return (
        <div className="terminal-projects">
          {projects.map((project) => (
            <article className="terminal-project" key={project.id}>
              <p className="terminal-heading">{project.title}</p>
              <p>{project.description}</p>
              <p><span className="terminal-muted">Stack: </span>{project.technologies.join(', ')}</p>
              {project.liveLink && <p><span className="terminal-muted">Live: </span><a href={project.liveLink} target="_blank" rel="noreferrer">{project.liveLink}</a></p>}
              {project.githubLink && <p><span className="terminal-muted">Source: </span><a href={project.githubLink} target="_blank" rel="noreferrer">{project.githubLink}</a></p>}
            </article>
          ))}
        </div>
      );
    case 'skills':
      return (
        <div className="terminal-copy">
          <p><span className="terminal-heading">Frontend:</span> HTML, CSS, JavaScript, React, Tailwind CSS, Sass, Bootstrap</p>
          <p><span className="terminal-heading">Backend:</span> Python, PHP, Node.js, Express.js, Flask, Laravel</p>
          <p><span className="terminal-heading">Data:</span> MongoDB, MySQL, Hadoop, HBase, Redis, Cassandra</p>
          <p><span className="terminal-heading">AI:</span> Artificial Intelligence, Machine Learning, Deep Learning, CNN, NLP</p>
          <p><span className="terminal-heading">Other:</span> Cybersecurity, REST APIs, Digital Transformation</p>
        </div>
      );
    case 'experience':
      return (
        <div className="terminal-copy">
          <p className="terminal-heading">Full Stack Developer — 1 year</p>
          <p>Experience building web and AI-driven solutions across academic, enterprise, and research environments.</p>
        </div>
      );
    case 'education':
      return <p>Education details are not currently listed on the portfolio. Please check back later for updates.</p>;
    case 'contact':
      return (
        <div className="terminal-copy">
          <p>Email: <a href="mailto:issamoubenazha@gmail.com">issamoubenazha@gmail.com</a></p>
          <p>Phone / WhatsApp: <a href="https://wa.me/212656822152" target="_blank" rel="noreferrer">+212 656822152</a></p>
          <p>LinkedIn: <a href="https://www.linkedin.com/in/issam-oubenazha" target="_blank" rel="noreferrer">linkedin.com/in/issam-oubenazha</a></p>
          <p>GitHub: <a href="https://github.com/issam-oubenazha" target="_blank" rel="noreferrer">github.com/issam-oubenazha</a></p>
        </div>
      );
    case 'social':
      return (
        <div className="terminal-copy">
          <p>LinkedIn: <a href="https://www.linkedin.com/in/issam-oubenazha" target="_blank" rel="noreferrer">linkedin.com/in/issam-oubenazha</a></p>
          <p>GitHub: <a href="https://github.com/issam-oubenazha" target="_blank" rel="noreferrer">github.com/issam-oubenazha</a></p>
        </div>
      );
    case 'resume':
      return <p><a href="/cv/oubenazhai.pdf" target="_blank" rel="noreferrer">Open Issam&apos;s resume (PDF)</a></p>;
    default:
      return null;
  }
}

function Terminal({
  isActive,
  onExit,
}: {
  isActive: boolean;
  onExit: () => void;
}) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [historyDraft, setHistoryDraft] = useState('');
  const [completionHint, setCompletionHint] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(0);
  const [shell] = useState(createShellContext);

  useEffect(() => {
    if (isActive) inputRef.current?.focus();
  }, [isActive]);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  const addEntry = useCallback((enteredCommand: string, prompt: string, output?: ReactNode, kind?: OutputKind) => {
    setEntries((current) => [...current, {
      id: nextEntryId.current++,
      command: enteredCommand,
      prompt,
      output,
      kind,
    }]);
  }, []);

  const runCommand = useCallback((enteredCommand: string) => {
    const trimmed = enteredCommand.trim();
    if (!trimmed) return;
    const shellContext = shell;
    const lowered = trimmed.toLowerCase();
    const legacyPortfolioCommand = /^cd\s+(help|about|projects|skills|experience|education|contact)$/i.exec(trimmed);

    if (legacyPortfolioCommand && !virtualPathExists(shellContext, legacyPortfolioCommand[1])) {
      const name = legacyPortfolioCommand[1].toLowerCase();
      shellContext.history.push(trimmed);
      addEntry(trimmed, terminalPrompt(shellContext.cwd), <PortfolioOutput name={name} />);
      return;
    }

    if (lowered === 'exit') {
      shellContext.history.push(trimmed);
      onExit();
      return;
    }

    for (const part of splitCommands(trimmed)) {
      const prompt = terminalPrompt(shellContext.cwd);
      shellContext.history.push(part);
      if (part.toLowerCase() === 'exit') {
        onExit();
        return;
      }

      const portfolioName = part.toLowerCase();
      if (portfolioCommands.some(([name]) => name === portfolioName)) {
        addEntry(part, prompt, <PortfolioOutput name={portfolioName} />);
        continue;
      }

      const result = runVirtualCommand(part, shellContext);
      if (result.clear) {
        setEntries([]);
        continue;
      }
      if (result.cwd !== undefined) shellContext.cwd = result.cwd;
      if (result.previousDirectory !== undefined) shellContext.previousDirectory = result.previousDirectory;
      addEntry(part, prompt, result.output, result.kind);
    }
  }, [addEntry, onExit, shell]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredCommand = command.trim();
    setCommand('');
    setCompletionHint('');
    setHistoryIndex(-1);
    setHistoryDraft('');
    if (!enteredCommand) return;
    setCommandHistory((current) => [...current, enteredCommand]);
    runCommand(enteredCommand);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      setEntries([]);
      setCompletionHint('');
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      if (command) {
        addEntry(`${command} ^C`, 'Command cancelled.', 'warning');
        setCommand('');
      }
      setCompletionHint('');
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const tokens = command.split(/\s+/);
      const currentToken = tokens[tokens.length - 1] || '';
      const isCommand = tokens.length === 1 && !command.endsWith(' ');
      const candidates = isCommand
        ? shellCommands.filter((name) => name.startsWith(currentToken))
        : completePath(currentToken, shell);
      if (candidates.length === 1) {
        tokens[tokens.length - 1] = candidates[0];
        setCommand(tokens.join(' '));
        setCompletionHint('');
      } else if (candidates.length > 1) {
        const commonPrefix = candidates.reduce((prefix, item) => {
          let length = 0;
          while (length < prefix.length && prefix[length] === item[length]) length += 1;
          return prefix.slice(0, length);
        });
        if (commonPrefix.length > currentToken.length) {
          tokens[tokens.length - 1] = commonPrefix;
          setCommand(tokens.join(' '));
        }
        setCompletionHint(candidates.join('    '));
      }
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandHistory.length) return;
      if (historyIndex === -1) setHistoryDraft(command);
      const nextIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setCommand(historyDraft);
      } else {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      }
    }
  };

  const shellPrompt = terminalPrompt(shell.cwd);

  return (
    <section
      aria-label="Interactive portfolio terminal"
      className="terminal-window"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a, button')) return;
        inputRef.current?.focus();
      }}
    >
      <header className="terminal-toolbar">
        <div className="terminal-brand">
          <span className="terminal-brand-mark" aria-hidden="true">$_</span>
          <div>
            <p className="terminal-title">Portfolio Terminal</p>
            <p className="terminal-subtitle">issam@portfolio · isolated virtual shell</p>
          </div>
        </div>
        <div className="terminal-toolbar-actions">
          <span className="terminal-status"><span aria-hidden="true" />SESSION ACTIVE</span>
          <button className="terminal-exit-button" onClick={onExit} type="button">
            <span aria-hidden="true">↗</span> Exit terminal <kbd>Esc</kbd>
          </button>
        </div>
      </header>

      <div className="terminal-content">
        <div className="terminal-output" ref={outputRef} aria-live="polite">
          <div className="terminal-welcome">
            <p className="terminal-welcome-title">Welcome to Issam&apos;s portfolio shell.</p>
            <p>A private, in-memory Linux-style environment. Your files stay in this browser session.</p>
            <p>Run <code>help</code> for commands, or <code>neofetch</code> for system information.</p>
          </div>
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              <div className="terminal-command-line">
                <span className="terminal-prompt">{entry.prompt}</span>
                <span className="terminal-entered-command">
                  <span className="terminal-command-name">{entry.command.split(/\s/)[0]}</span>
                  {entry.command.slice(entry.command.split(/\s/)[0].length)}
                </span>
              </div>
              {entry.output !== undefined && entry.output !== '' && (
                <div className={`terminal-result${entry.kind ? ` terminal-result-${entry.kind}` : ''}`}>
                  {typeof entry.output === 'string'
                    ? renderShellOutput(entry.output, entry.command, entry.id)
                    : entry.output}
                </div>
              )}
            </div>
          ))}
        </div>

        <form className="terminal-input-area" onSubmit={handleSubmit}>
          <div className="terminal-input-line">
            <label className="terminal-prompt" htmlFor="terminal-command">{shellPrompt}</label>
            <input
              autoComplete="off"
              autoCapitalize="none"
              className="terminal-input"
              id="terminal-command"
              onChange={(event) => {
                setCommand(event.target.value);
                setCompletionHint('');
              }}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              spellCheck={false}
              type="text"
              value={command}
              aria-label="Enter a virtual terminal command"
            />
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
          {completionHint && <p className="terminal-completion-hint">{completionHint}</p>}
          <div className="terminal-shortcuts" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> history</span>
            <span><kbd>Tab</kbd> autocomplete</span>
            <span><kbd>Ctrl</kbd> + <kbd>L</kbd> clear</span>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function TerminalMode({ children }: TerminalModeProps) {
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreFocusRef = useRef(false);

  const exitTerminal = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      restoreFocusRef.current = true;
      setIsTerminalMode(false);
      setIsExiting(false);
    }, 240);
  }, [isExiting]);

  useEffect(() => {
    if (!isTerminalMode && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      modeButtonRef.current?.focus();
    }
  }, [isTerminalMode]);

  useEffect(() => {
    if (!isTerminalMode) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        exitTerminal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [exitTerminal, isTerminalMode]);

  useEffect(() => () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
  }, []);

  return (
    <>
      <div
        aria-hidden={isTerminalMode}
        className={`terminal-portfolio${isTerminalMode ? ' terminal-portfolio-hidden' : ''}`}
      >
        {children}
        <button
          aria-label="Open full-screen terminal"
          className="terminal-mode-toggle"
          onClick={() => setIsTerminalMode(true)}
          ref={modeButtonRef}
          type="button"
        >
          <span aria-hidden="true">&gt;_</span>
          Terminal
        </button>
      </div>
      <div
        aria-hidden={!isTerminalMode}
        className={`terminal-overlay${isExiting ? ' terminal-overlay-exiting' : ''}`}
        hidden={!isTerminalMode}
      >
        <Terminal isActive={isTerminalMode} onExit={exitTerminal} />
      </div>
    </>
  );
}

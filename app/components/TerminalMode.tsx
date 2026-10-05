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
import './TerminalMode.css';

type TerminalEntry = {
  id: number;
  command: string;
  output?: ReactNode;
};

type TerminalModeProps = {
  children: ReactNode;
};

const commandHelp = [
  ['cd help', 'Show available commands'],
  ['cd about', 'About me'],
  ['cd projects', 'Show my projects'],
  ['cd skills', 'Show my technical skills'],
  ['cd experience', 'Show my experience'],
  ['cd education', 'Show my education'],
  ['cd contact', 'Show contact information'],
];

const directCommandHelp = [
  ['clear', 'Clear terminal'],
  ['exit', 'Return to normal portfolio'],
];

function Terminal() {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [historyDraft, setHistoryDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [entries]);

  const commandHandlers: Record<string, () => ReactNode> = {
    help: () => (
      <div className="terminal-help">
        <p className="terminal-muted">Available commands:</p>
        {commandHelp.map(([name, description]) => (
          <div className="terminal-help-row" key={name}>
            <code>{name}</code>
            <span className="terminal-muted" aria-hidden="true">→</span>
            <span>{description}</span>
          </div>
        ))}
        <div className="terminal-help-gap" aria-hidden="true" />
        {directCommandHelp.map(([name, description]) => (
          <div className="terminal-help-row" key={name}>
            <code>{name}</code>
            <span className="terminal-muted" aria-hidden="true">→</span>
            <span>{description}</span>
          </div>
        ))}
      </div>
    ),
    about: () => (
      <div className="terminal-copy">
        <p className="terminal-heading">Issam Oubenazha</p>
        <p>Full Stack Developer and AI &amp; Data Scientist.</p>
        <p>
          I build scalable, user-friendly web and AI-driven solutions, with
          interests in AI, cybersecurity, and digital transformation.
        </p>
      </div>
    ),
    projects: () => (
      <div className="terminal-projects">
        {projects.map((project) => (
          <article className="terminal-project" key={project.id}>
            <p className="terminal-heading">{project.title}</p>
            <p>{project.description}</p>
            <p>
              <span className="terminal-muted">Stack: </span>
              {project.technologies.join(', ')}
            </p>
            {project.liveLink && (
              <p>
                <span className="terminal-muted">Live: </span>
                <a href={project.liveLink} target="_blank" rel="noreferrer">
                  {project.liveLink}
                </a>
              </p>
            )}
            {project.githubLink && (
              <p>
                <span className="terminal-muted">Source: </span>
                <a href={project.githubLink} target="_blank" rel="noreferrer">
                  {project.githubLink}
                </a>
              </p>
            )}
          </article>
        ))}
      </div>
    ),
    skills: () => (
      <div className="terminal-copy">
        <p><span className="terminal-heading">Frontend:</span> HTML, CSS, JavaScript, React, Tailwind CSS, Sass, Bootstrap</p>
        <p><span className="terminal-heading">Backend:</span> Python, PHP, Node.js, Express.js, Flask, Laravel</p>
        <p><span className="terminal-heading">Data:</span> MongoDB, MySQL, Hadoop, HBase, Redis, Cassandra</p>
        <p><span className="terminal-heading">AI:</span> Artificial Intelligence, Machine Learning, Deep Learning, CNN, NLP</p>
        <p><span className="terminal-heading">Other:</span> Cybersecurity, REST APIs, Digital Transformation</p>
      </div>
    ),
    experience: () => (
      <div className="terminal-copy">
        <p className="terminal-heading">Full Stack Developer — 1 year</p>
        <p>
          Experience building web and AI-driven solutions across academic,
          enterprise, and research environments.
        </p>
      </div>
    ),
    education: () => (
      <p>
        Education details are not currently listed on the portfolio. Please
        check back later for updates.
      </p>
    ),
    contact: () => (
      <div className="terminal-copy">
        <p>Email: <a href="mailto:issamoubenazha@gmail.com">issamoubenazha@gmail.com</a></p>
        <p>Phone / WhatsApp: <a href="https://wa.me/212656822152" target="_blank" rel="noreferrer">+212 656822152</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/issam-oubenazha" target="_blank" rel="noreferrer">linkedin.com/in/issam-oubenazha</a></p>
        <p>GitHub: <a href="https://github.com/issam-oubenazha" target="_blank" rel="noreferrer">github.com/issam-oubenazha</a></p>
      </div>
    ),
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredCommand = command.trim().toLowerCase();
    setCommand('');
    setHistoryIndex(-1);
    setHistoryDraft('');

    if (!enteredCommand) {
      inputRef.current?.focus();
      return;
    }

    let output: ReactNode;
    if (enteredCommand === 'clear') {
      setEntries([]);
      setHistory((currentHistory) => [...currentHistory, enteredCommand]);
      inputRef.current?.focus();
      return;
    } else if (enteredCommand === 'exit') {
      window.dispatchEvent(new CustomEvent('portfolio:exit-terminal'));
      return;
    } else if (enteredCommand === 'cd') {
      output = <>Usage: cd &lt;command&gt;<br />Type &quot;cd help&quot; to see available commands.</>;
    } else if (!enteredCommand.startsWith('cd ')) {
      output = <>Command not found.<br />Type &quot;cd help&quot; to see available commands.</>;
    } else {
      const [commandName, ...args] = enteredCommand.slice(3).trim().split(/\s+/);
      if (!commandName || args.length > 0 || !commandHandlers[commandName]) {
        output = <>Command not found.<br />Type &quot;cd help&quot; to see available commands.</>;
      } else {
        output = commandHandlers[commandName]();
      }
    }

    setEntries((currentEntries) => [
      ...currentEntries,
      {
        id: nextEntryId.current++,
        command: enteredCommand,
        output,
      },
    ]);
    setHistory((currentHistory) => [...currentHistory, enteredCommand]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) setHistoryDraft(command);
      const nextIndex = historyIndex === -1
        ? history.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(history[nextIndex]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setCommand(historyDraft);
      } else {
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    }
  };

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
        <div className="terminal-window-controls" aria-hidden="true">
          <span className="terminal-control terminal-control-close" />
          <span className="terminal-control terminal-control-minimize" />
          <span className="terminal-control terminal-control-maximize" />
        </div>
        <p className="terminal-title">issam@portfolio: ~</p>
        <span className="terminal-toolbar-spacer" />
      </header>

      <div className="terminal-content">
        <div className="terminal-output" ref={outputRef} aria-live="polite">
          <p className="terminal-welcome">
            Welcome to Issam&apos;s portfolio terminal.
            <br />
            Type <code>cd help</code> to see the available commands.
          </p>
          {entries.map((entry) => (
            <div className="terminal-entry" key={entry.id}>
              <div className="terminal-command-line">
                <span className="terminal-prompt">issam@portfolio:~$</span>
                <span>{entry.command}</span>
              </div>
              {entry.output && <div className="terminal-result">{entry.output}</div>}
            </div>
          ))}
        </div>

        <form className="terminal-input-line" onSubmit={handleSubmit}>
          <label className="terminal-prompt" htmlFor="terminal-command">
            issam@portfolio:~$
          </label>
          <input
            autoComplete="off"
            autoCapitalize="none"
            className="terminal-input"
            id="terminal-command"
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={command}
            aria-label="Enter a terminal command"
          />
          <span className="terminal-cursor" aria-hidden="true" />
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

  const exitTerminal = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      setIsTerminalMode(false);
      setIsExiting(false);
      modeButtonRef.current?.focus();
    }, 320);
  }, [isExiting]);

  useEffect(() => {
    window.addEventListener('portfolio:exit-terminal', exitTerminal);
    return () => {
      window.removeEventListener('portfolio:exit-terminal', exitTerminal);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, [exitTerminal]);

  return (
    <>
      <div
        aria-hidden={isTerminalMode && !isExiting}
        className={`terminal-portfolio${isTerminalMode && !isExiting ? ' terminal-portfolio-hidden' : ''}`}
      >
        {children}
        <button
          className="terminal-mode-toggle"
          onClick={() => setIsTerminalMode(true)}
          ref={modeButtonRef}
          type="button"
        >
          <span aria-hidden="true">&gt;_</span>
          Terminal Mode
        </button>
      </div>
      {isTerminalMode && (
        <div
          className={`terminal-overlay${isExiting ? ' terminal-overlay-exiting' : ''}`}
        >
          <Terminal />
          <button
            className="terminal-normal-mode"
            onClick={exitTerminal}
            type="button"
          >
            Normal Mode
          </button>
        </div>
      )}
    </>
  );
}

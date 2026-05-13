export async function executeCode(code: string, language: string) {
  const languageMap: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'python3',
    rust: 'rust',
    go: 'go',
    cpp: 'cpp'
  };

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      body: JSON.stringify({
        language: languageMap[language.toLowerCase()] || language,
        version: '*',
        files: [{ content: code }]
      })
    });
    const data = await response.json();
    return data.run?.output || data.message || 'Execution error';
  } catch (error) {
    console.error('Execution failed:', error);
    return 'Failed to reach execution server.';
  }
}

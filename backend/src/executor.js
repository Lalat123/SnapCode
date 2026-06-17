const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const util = require('util');
const { performance } = require('perf_hooks');

const execAsync = util.promisify(exec);

const executeCode = async (language, code, customInput) => {
  const tempDir = path.join(os.tmpdir(), `minijudge-${uuidv4()}`);
  await fs.mkdir(tempDir, { recursive: true });

  let result = {
    status: 'Pending',
    output: '',
    time: 0,
    memory: 'N/A'
  };

  try {
    const inputPath = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputPath, customInput || '');

    if (language === 'python') {
      const codePath = path.join(tempDir, 'main.py');
      await fs.writeFile(codePath, code);

      const runCmd = `python "main.py" < "input.txt"`;
      
      const start = performance.now();
      try {
        const { stdout, stderr } = await execAsync(runCmd, { cwd: tempDir, timeout: 10000, maxBuffer: 1024 * 1024 * 10 });
        const end = performance.now();
        
        if (stderr) {
          result.status = 'Runtime Error';
          result.output = stderr;
        } else {
          result.status = 'Successfully executed';
          result.output = stdout;
        }
        result.time = ((end - start) / 1000).toFixed(4);
        result.memory = (Math.random() * 4 + 6).toFixed(2) + ' MB'; // Mocking memory for local demo
      } catch (err) {
        if (err.killed) {
          result.status = 'Time Limit Exceeded';
        } else {
          result.status = 'Runtime Error';
          result.output = err.stderr || err.message;
        }
      }
    } else if (language === 'cpp') {
      const codePath = path.join(tempDir, 'main.cpp');
      await fs.writeFile(codePath, code);

      const compileCmd = `g++ -O2 main.cpp -o main.exe`;
      try {
        await execAsync(compileCmd, { cwd: tempDir, timeout: 10000 });
      } catch (err) {
        result.status = 'Compilation Error';
        result.output = err.stderr || err.message;
        return result;
      }

      const runCmd = `main.exe < "input.txt"`;
      
      const start = performance.now();
      try {
        const { stdout, stderr } = await execAsync(runCmd, { cwd: tempDir, timeout: 10000, maxBuffer: 1024 * 1024 * 10 });
        const end = performance.now();
        
        if (stderr) {
          result.status = 'Runtime Error';
          result.output = stderr;
        } else {
          result.status = 'Successfully executed';
          result.output = stdout;
        }
        result.time = ((end - start) / 1000).toFixed(4);
        result.memory = (Math.random() * 4 + 4).toFixed(2) + ' MB'; // Mocking memory for C++
      } catch (err) {
        if (err.killed) {
          result.status = 'Time Limit Exceeded';
        } else {
          result.status = 'Runtime Error';
          result.output = err.stderr || err.message;
        }
      }
    } else if (language === 'javascript') {
      const codePath = path.join(tempDir, 'main.js');
      await fs.writeFile(codePath, code);

      const runCmd = `node "main.js" < "input.txt"`;
      
      const start = performance.now();
      try {
        const { stdout, stderr } = await execAsync(runCmd, { cwd: tempDir, timeout: 10000, maxBuffer: 1024 * 1024 * 10 });
        const end = performance.now();
        
        if (stderr) {
          result.status = 'Runtime Error';
          result.output = stderr;
        } else {
          result.status = 'Successfully executed';
          result.output = stdout;
        }
        result.time = ((end - start) / 1000).toFixed(4);
        result.memory = (Math.random() * 4 + 20).toFixed(2) + ' MB';
      } catch (err) {
        if (err.killed) {
          result.status = 'Time Limit Exceeded';
        } else {
          result.status = 'Runtime Error';
          result.output = err.stderr || err.message;
        }
      }
    } else if (language === 'java') {
      const codePath = path.join(tempDir, 'Main.java');
      await fs.writeFile(codePath, code);

      const compileCmd = `javac Main.java`;
      try {
        await execAsync(compileCmd, { cwd: tempDir, timeout: 10000 });
      } catch (err) {
        result.status = 'Compilation Error';
        result.output = err.stderr || err.message;
        return result;
      }

      const runCmd = `java Main < "input.txt"`;
      
      const start = performance.now();
      try {
        const { stdout, stderr } = await execAsync(runCmd, { cwd: tempDir, timeout: 10000, maxBuffer: 1024 * 1024 * 10 });
        const end = performance.now();
        
        if (stderr) {
          result.status = 'Runtime Error';
          result.output = stderr;
        } else {
          result.status = 'Successfully executed';
          result.output = stdout;
        }
        result.time = ((end - start) / 1000).toFixed(4);
        result.memory = (Math.random() * 10 + 30).toFixed(2) + ' MB';
      } catch (err) {
        if (err.killed) {
          result.status = 'Time Limit Exceeded';
        } else {
          result.status = 'Runtime Error';
          result.output = err.stderr || err.message;
        }
      }
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      console.error('Failed to cleanup temp dir', e);
    }
  }

  return result;
};

module.exports = { executeCode };

// Packages
import Store from 'electron-store';
import { app, BrowserWindow, globalShortcut, Menu, MenuItem } from 'electron';
import path from 'path';
import contextMenu from 'electron-context-menu';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

path.join(app.getPath('userData'), 'config.json');

const store = new Store({
  configFileMode: 0o755,
  defaults: {
    x: undefined,
    y: undefined,
    width: 1280,
    height: 720,
  },
});

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      spellcheck: true, // Enable spellcheck for right-click word correction
    },
    x: store.get('x'),
    y: store.get('y'),
    width: store.get('width'),
    height: store.get('height'),
    icon: path.join(__dirname, '/images/icon.png'), // Set the app icon
  });

  const url = 'https://bsky.app/';

  mainWindow.loadURL(url);

  mainWindow.once('close', () => {
    const { x, y, width, height } = mainWindow.getBounds();
    store.set('x', x);
    store.set('y', y);
    store.set('width', width);
    store.set('height', height);
  });

  globalShortcut.register('F5', () => {
    mainWindow.reload();
  });

  contextMenu({
    showSaveImageAs: true, 
  })

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);
});

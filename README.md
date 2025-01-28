## Odysseus

# Zapret Discord YouTube

This application is designed to block YouTube playback in Discord via the "Activity" feature. It is specifically tailored for **Windows 10/11** and provides a portable version for easy use.

## Building the Application

To create the `dist` folder with the executable files, follow these steps:

1. **Install Dependencies**  
    Make sure all dependencies are installed:
    ```bash
	npm install
	```
    
2. **Build the Application**  
    Run the build script to create the `dist` folder:
    
    ```bash
	npm run build
	```
    
    This will generate the following files/folders:
    
    - `dist/win-unpacked/`: Portable version of the application.
        
    - `dist/Zapret UI Setup 1.0.0.exe`: Installer for Windows.
        
3. **Run the Application**
    
    - For the portable version, navigate to `dist/win-unpacked/` and run `Zapret UI.exe`.
        
    - For the installer, run `dist/Zapret UI Setup 1.0.0.exe` and follow the installation instructions.

## Features

- Blocks YouTube playback in Discord.
    
- Portable version available in the `dist` folder.
    
- Integrated with the [zapret-discord-youtube](https://github.com/Flowseal/zapret-discord-youtube) submodule for core functionality.
    

## Requirements

- **Operating System**: Windows 10 or Windows 11.
    


## Installation

### Portable Version

1. Download the files from the `dist` folder.
    
2. Extract the files to your desired location.
    
3. Run the executable file to start the application.
    

### Note

- The application is **not console-adapted** as the paths are configured for the release version.
    
- The `zapret-discord-youtube` submodule is included for core functionality. Ensure you have the necessary dependencies installed.
    

## Usage

1. Launch the application.
    
2. Click the "Start" button to activate the blocking feature.
    
3. Click the "Stop" button to deactivate the blocking feature.
    

## Submodule Integration

This project uses the [zapret-discord-youtube](https://github.com/Flowseal/zapret-discord-youtube) submodule for its core functionality. To update the submodule, use the following command:

```
git submodule update --remote
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.


# VS Code FitNesse
[![MarketPlaceVersion](https://vsmarketplacebadge.apphb.com/version/chrisotto.vscodefitnesse.svg)](https://marketplace.visualstudio.com/items?itemName=chrisotto.vscodefitnesse)  [![MarketPlaceInstalls](https://vsmarketplacebadge.apphb.com/installs/chrisotto.vscodefitnesse.svg)](https://marketplace.visualstudio.com/items?itemName=chrisotto.vscodefitnesse)  [![MarketPlaceRating](https://vsmarketplacebadge.apphb.com/rating/chrisotto.vscodefitnesse.svg)](https://marketplace.visualstudio.com/items?itemName=chrisotto.vscodefitnesse) [![TravisCIBuild](https://travis-ci.org/chrisotto6/VSCodeFitNesse.svg?branch=master)](https://travis-ci.org/chrisotto6/VSCodeFitNesse)

A Visual Studio Code extension for your FitNesse tests.

## Features

 * Adds new language to VS Code
    * By adding the language, it ensures that the formatting only applies to content.txt files that get created with FitNesse
    * Allows for auto pairing on some of the FitNesse markup style's character formatting
 * Formats content.txt FitNesse files on save
 * Shfit + Alt + F - Format Keybinding
 * Menu option for formatting a directory
 * Menu option for formatting a specific file

### Demos
#### Format on Save
![SaveDemo](images/SaveDemo.gif)

#### Format from Menu
![MenuDemo](images/MenuDemo.gif)

#### Format Directory
![DirectoryDemo](images/DirectoryDemo.gif)

## Requirements

Be on the latest version of VS Code (utilizes workspaces), other than that there are no requirements or configurations for the end user to set up. 

## Known Issues

> As of right now only works with context.txt files any other kind of test caching or file extensions do not work. I believe the latest version of FitNesse comes
> with a new .wiki extension. If you need to format the .wiki file extension please log an issue to the Github page. 

## Major Release Notes

### 1.1.0

    * Added changes to README.md for better representation in marketplace
    * Added shift + alt + f key key binding for format of FitNesse files
    * Added menu option for formatting directories containing FitNesse files
    * Added menu option to format files from R-click in menu
    * Added Travis CI to validate master branch

### 1.0.0

    * Initial release of VS Code FitNesse.
    * Includes all main functional requirements outlined in the feature section. 

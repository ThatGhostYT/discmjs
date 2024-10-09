# create-discm
A cli to initialize discm.js projects.

## Getting Started
Run `npx create-discm` to run the cli.

It will then give you a series of prompts before installing discm.js and initializing the project.

To skip the prompts, use `npx create-discm -y` which will give the project a set of default settings to initialize the project under.
> [!NOTE]
> The default template is javascript, so if you want to use typescript do not use `-y`

> [!WARNING]
>If there is already a directory named after whatever name you provided the cli, it will either cancel the installation, overwrite conflicting files, or clear the directory. It will prompt you before doing one of these options.

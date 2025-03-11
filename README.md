# Real Time Chat Application

This is a real time Chat Application using Web Sockets

# Installation Steps Summary

Installation is not difficult, but there are many steps. This is a brief explanation of what needs to be done:

1. Install `git`
2. Download the code from GitHub using `git`
3. Install `node.js` (Node), the runtime environment the application will need to work.
4. Configure the Node Package Manager (`npm`) to automatically use the correct version of Node for our application.
5. Use `npm` to install TypeScript, the language the application is written in.
6. Install other supporting software such as the database.
7. Configure the application
8. Start the application

These steps are explained in more detail in the sections that follow.

# Prerequisites

In this section we'll explain how to set up all the prerequisite software packages to get you up and running.



## Setting up this repository

First you need a local copy of `Chat-Application`. Run the following command in the directory of choice on your local system.

1. On your computer, navigate to the folder where you want to setup the repository.
2. Open a `cmd` (Windows) or `terminal` (Linux or MacOS) session in this folder.
   1. An easy way to do this is to right-click and choose appropriate option based on your OS.
3. **For Our Open Source Contributor Software Developers:**

   1. Next, we'll fork and clone the `Chat-Application` repository.
   1. In your web browser, navigate to [https://github.com/AchyutTiwari21/Chat-Application](https://github.com/AchyutTiwari21/Chat-Application) and click on the `fork` button. It is placed on the right corner opposite the repository name `AchyutTiwari21/Chat-Application`.

   1. You should now see `Chat-Application` under your repositories. It will be marked as forked from `AchyutTiwari21/Chat-Application`

   1. Clone the repository to your local computer (replacing the values in `{{}}`):
      ```bash
      $ git clone https://github.com/{{YOUR GITHUB USERNAME}}/Chat-Application.git
      cd Chat-Application
      git checkout develop
      ```
      - **Note:** Make sure to check out the `develop` branch

## Install node.js

Best way to install and manage `node.js` is making use of node version managers. We recommend using `fnm`, which will be described in more detail later.

Install the `node.js` packages in Windows, Linux and MacOS listed in https://nodejs.org.

## Install TypeScript and pnpm

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional types, classes, and modules to JavaScript, and supports tools for large-scale JavaScript applications.

To install TypeScript, you can use the `npm` command which comes with `node.js`:

```bash
npm install -g typescript
```

pnpm (Performant Node Package Manager) is a fast and disk-space efficient package manager for JavaScript projects, designed as an alternative to npm and Yarn, that stores packages in a content-addressable store and uses hard links to reduce redundancy. 

To install pnpm, you can use the `npm` command which comes with `node.js`

```bash
npm install -g pnpm
```

This command installs TypeScript and pnpm globally on your system so that it can be accessed from any project.

## Install Required Packages

Run the following command to install the packages and dependencies required by the app:

```
pnpm install
```

The prerequisites are now installed. The next step will be to get the app up and running.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```
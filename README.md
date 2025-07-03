# CRED Garage-Inspired Dashboard (Vite + React + TypeScript)

A modern, responsive dashboard inspired by CRED Garage, built with Vite, React, TypeScript, Zustand, and Tailwind CSS. Features robust state management, subtle animations, and a focus on clean, maintainable code and high test coverage.

## Features

- ⚡️ **Vite** for fast development and builds
- ⚛️ **React** (with TypeScript) for UI
- 🎨 **Tailwind CSS** for styling
- 🗃️ **Zustand** for state management
- 🧪 **Vitest** for testing (Jest fully migrated)
- 📈 **100% test coverage** for stores and main app logic
- 🧩 Modular, reusable components
- 💎 Modern, CRED-inspired UI/UX with subtle animations
- 📊 Chart.js (mocked in tests)

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Start the development server

```sh
npm run dev
```

### 3. Run tests (with coverage)

```sh
npm test
# or for coverage
npm run test:coverage
```

### 4. Build for production

```sh
npm run build
```

### 5. Preview production build

```sh
npm run preview
```

## Project Structure

```
cred-test/
├── src/
│   ├── components/         # UI components (DashboardHeader, UserProfileSummary, etc.)
│   ├── store/              # Zustand stores (userStore, rewardsStore, benefitsStore)
│   ├── lib/                # Utilities
│   ├── assets/             # Static assets
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── setupTests.ts       # Vitest global setup/mocks
├── public/                 # Static public assets
├── package.json            # Scripts and dependencies
├── tailwind.config.js      # Tailwind CSS config
├── vitest.config.ts        # Vitest config
└── README.md               # This file
```

## Testing & Coverage

- All tests use **Vitest** and **@testing-library/react**.
- Zustand stores and Chart.js are robustly mocked for ESM compatibility.
- 100% coverage for main app logic and stores.
- To view coverage report:

  ```sh
  npm run test:coverage
  # Open coverage/index.html in your browser
  ```

## Linting & Formatting

- ESLint and Prettier are configured for strict, consistent code style.
- Run lint:

  ```sh
  npm run lint
  ```

## Credits

- Inspired by [CRED Garage](https://cred.club/garage)
- Built with ❤️ by your team

---

For questions or contributions, please open an issue or PR.

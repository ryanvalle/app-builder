# AI App Builder

An Opal-like no-code AI application builder that lets you create powerful AI-powered workflows through natural language and a visual interface.

## Features

### Core Functionality
- **Conversational Interface**: Describe what you want to build in natural language
- **Visual Workflow Editor**: Drag-and-drop node-based editor for building workflows
- **Dual Editor Modes**: Switch seamlessly between chat mode and visual mode
- **Real-time Execution**: Run workflows step-by-step with live debugging
- **Console Panel**: Monitor execution with detailed logs and error tracking

### Node Types
- **Input**: Capture user inputs (text, files, etc.)
- **AI Model**: Integrate with AI models (GPT-4, Claude, Gemini, etc.)
- **API Call**: Make REST API requests with full configuration
- **Data Processing**: Transform data with custom JavaScript code
- **Webhook**: Receive incoming webhooks to trigger workflows
- **Output**: Display results to users

### API Integration
- **Full REST API Support**: Configure GET, POST, PUT, DELETE, PATCH requests
- **Multiple Authentication Types**:
  - API Key
  - Bearer Token
  - OAuth 2.0
  - Basic Authentication
  - Custom Headers
- **Request Configuration**:
  - Custom headers
  - Query parameters
  - Request body (JSON, form-data, raw)
- **Response Mapping**: Extract and transform API response data
- **Error Handling**: Configure retries, timeouts, and fallback behaviors
- **API Library**: Save and reuse API configurations across workflows

### Template Gallery
Pre-built templates to get you started:
- **Document Summarizer**: Upload documents and get AI-powered summaries
- **Customer Support Reply Generator**: Generate professional support responses
- **Marketing Copy Enhancer**: Improve marketing copy with AI
- **Personal Task Planner**: Break down goals into actionable tasks
- **Research Assistant**: Web scraping with AI analysis

### Sharing & Deployment
- **Instant Sharing**: Generate shareable links for your workflows
- **No Backend Required**: Everything runs in the browser
- **Local Storage**: Workflows are saved automatically

## Getting Started

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker, which avoids dependency installation issues:

**Prerequisites:**
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Development:**
```bash
# Start the development server
docker-compose up

# The app will be available at http://localhost:5173
```

**Production Build:**
```bash
# Build production image
docker build -f Dockerfile.prod -t app-builder:prod .

# Run production container
docker run -p 80:80 app-builder:prod

# The app will be available at http://localhost
```

**Docker Commands:**
```bash
# Rebuild after code changes
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Remove volumes
docker-compose down -v
```

### Option 2: Local Installation

If you prefer to run without Docker:

**Prerequisites:**
- Node.js 20 or higher
- npm or yarn

**Installation:**
```bash
npm install
```

**Development:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Build:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

> **Note:** If you encounter `patch-package: command not found` errors during installation, use the Docker option above or install patch-package globally: `npm install -g patch-package`

## Usage

### Creating a Workflow

1. **Choose a Template or Start Blank**
   - Select from pre-built templates on the home screen
   - Or create a blank workflow to start from scratch

2. **Add Nodes**
   - In Visual mode, click the node buttons in the left panel
   - Drag nodes to position them on the canvas
   - Connect nodes by dragging from the output handle to an input handle

3. **Configure Nodes**
   - Click on any node to open the configuration panel
   - Set up prompts for AI models
   - Configure API endpoints and authentication
   - Write data processing code

4. **Test Your Workflow**
   - Click "Run Workflow" in the Console panel
   - Watch execution in real-time
   - Debug errors as they occur

5. **Share Your App**
   - Click the "Share" button in the header
   - Copy the generated link
   - Anyone with the link can use your workflow

### Using Chat Mode

Switch to Chat mode to describe changes in natural language:

```
"Add an API call to fetch weather data"
"Change the AI model to Claude"
"Add a step to filter the results by date"
```

The AI assistant will help you understand how to implement your changes.

### Configuring API Calls

1. Click on an API Call node
2. Set the API URL
3. Choose the HTTP method
4. Configure authentication:
   - For API Key: Enter the key and header name
   - For Bearer Token: Enter the token
   - For OAuth: Configure client credentials
5. Add query parameters or request body as needed
6. Test the API call before adding to workflow

## Project Structure

```
src/
├── components/          # React components
│   ├── nodes/          # Custom node components
│   ├── Header.tsx      # Main header with navigation
│   ├── TemplateGallery.tsx  # Template selection screen
│   ├── WorkflowEditor.tsx   # Visual workflow editor
│   ├── ChatInterface.tsx    # Natural language interface
│   ├── ConsolePanel.tsx     # Execution logs and debugging
│   └── NodeConfigPanel.tsx  # Node configuration UI
├── store/              # Zustand state management
│   └── appStore.ts     # Global application state
├── templates/          # Pre-built workflow templates
│   └── index.ts        # Template definitions
├── types/              # TypeScript type definitions
│   └── workflow.ts     # Workflow-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **@xyflow/react**: Node-based workflow editor
- **Zustand**: State management
- **Lucide React**: Icon library

## Future Enhancements

- Integration with actual AI model APIs (OpenAI, Anthropic, Google)
- Backend for secure credential storage
- Real API testing interface
- Workflow versioning
- User authentication
- Collaborative editing
- More node types (database, file operations, etc.)
- Workflow marketplace
- Advanced debugging tools

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
# TradeInsights - AI-Powered Trading Platform

A comprehensive trading intelligence platform that combines market analysis, AI agents, and multiple LLM provider support with real trading integration via Alpaca.

## Core Features

### Fully Implemented & Functional

#### 1. **LLM Provider Management**
- Support for 8+ LLM providers:
  - OpenAI (GPT-4, GPT-4-Turbo, etc.)
  - Anthropic Claude (Claude 3 series)
  - Google Gemini
  - Groq (Mixtral, Llama)
  - DeepSeek
  - HuggingFace Inference API
  - Ollama (local models)
  - xAI (Grok)
- Secure API key storage in browser localStorage
- Provider-specific configuration (endpoints, model names, parameters)
- Temperature, max tokens, and top-P controls
- Activate/switch between multiple providers
- Full CRUD operations for provider management

#### 2. **AI Agent Builder**
- Create custom trading agents with configurable:
  - Purpose (trading, analysis, research, monitoring)
  - Role and system instructions
  - Available tools (11 different tools)
  - LLM provider selection
- Agent purposes supported:
  - **Trading**: Execute trades and manage positions
  - **Analysis**: Analyze market data and trends
  - **Research**: Research companies and market conditions
  - **Monitoring**: Monitor positions and alerts
- Available tools:
  - `get_market_data` - Fetch current market data
  - `place_order` - Execute buy/sell orders
  - `cancel_order` - Cancel pending orders
  - `get_positions` - View current positions
  - `get_account_info` - Account details
  - `analyze_sentiment` - Sentiment analysis
  - `technical_analysis` - TA indicators
  - `risk_assessment` - Risk calculations
  - `portfolio_optimization` - Portfolio allocation
  - `news_search` - Financial news
  - `price_alerts` - Alert management

#### 3. **Alpaca Trading Integration**
- Full API endpoint configuration (paper and live trading)
- Secure API key and secret key storage
- Account type selection (paper trading for testing, live for real money)
- Alpaca service with complete trading capabilities:
  - Get account information and buying power
  - View current positions
  - Place market and limit orders
  - Cancel orders
  - Close positions
  - Access order history
  - Retrieve market data and historical bars
  - Manage watchlists
  - Real-time quote fetching

#### 4. **Settings Interface**
- Tabbed settings panel with 4 sections:
  - **General**: Notifications, reporting, preferences
  - **LLM Providers**: Configure and manage LLM providers
  - **Alpaca Trading**: Connect and configure trading account
  - **AI Agents**: Create and manage trading agents
- Persistent storage using browser localStorage
- Settings export/import functionality
- Data validation and error handling

#### 5. **Dashboard & Market Overview**
- Interactive market overview with real-time data
- Advanced charting with Recharts
- Portfolio tracking
- Quick insights and alerts
- Performance monitoring
- Sentiment analysis visualization

#### 6. **Notification System**
- Pre-market and pre-close alerts
- Custom price alerts
- Sentiment-based notifications
- Email and push notification preferences
- Trading activity notifications

#### 7. **Data & Security**
- Client-side encryption support for sensitive data
- Row Level Security (RLS) policies on Supabase
- User-scoped data access
- Secure authentication ready

---

## What Needs to Be Added/Enhanced

### 1. **Backend Integration**
- Edge Functions for:
  - Real-time data streaming from Alpaca
  - Webhook handling for trade confirmations
  - Encryption/decryption of API keys (currently stored in plain localStorage)
  - Agent execution and orchestration
- Supabase database persistence for:
  - LLM provider configurations (partially setup)
  - Agent configurations (schema created)
  - Execution logs and history
  - Trade history and results

### 2. **Agent Execution Engine**
- Runtime environment for agents to:
  - Execute tool calls
  - Interact with Alpaca API
  - Analyze market data
  - Make trading decisions
  - Log execution results
- Agent orchestration system
- Multi-agent coordination

### 3. **Real-Time Data Integration**
- Live market data streaming (currently using mock data)
- Real-time position updates
- Order execution monitoring
- Price alerts triggered on actual market data
- WebSocket connections for live quotes

### 4. **Advanced Analytics**
- Machine learning models for:
  - Price prediction
  - Sentiment scoring
  - Anomaly detection
  - Pattern recognition
- Technical indicator calculations
- Risk metrics and VAR

### 5. **Agent Learning & Optimization**
- Store agent performance metrics
- Track decision accuracy and outcomes
- Implement feedback loops
- Agent strategy optimization over time

### 6. **Multi-Account Support**
- Multiple Alpaca accounts per user
- Account switching/selection
- Consolidated portfolio view across accounts

### 7. **Compliance & Reporting**
- Trade audit logs
- Tax reporting data
- Performance attribution
- Risk reporting
- Regulatory compliance tracking

### 8. **Testing & Validation**
- Unit tests for core functions
- Integration tests with Alpaca API (using paper trading)
- Agent behavior testing
- Stress testing for multiple agents

### 9. **Production Readiness**
- API rate limiting on Edge Functions
- Error recovery and retry logic
- Comprehensive logging
- Monitoring and alerting
- Performance optimization (current bundle: 664KB, should optimize)

### 10. **Advanced Features**
- Backtesting engine
- Paper trading simulation
- Strategy templates
- Risk management rules
- Position sizing calculations
- Correlation analysis
- Diversification recommendations

---

## Architecture Overview

```
Frontend (React + TypeScript)
├── Components
│   ├── Settings (General, LLM, Alpaca, Agents tabs)
│   ├── LLMSettings (Provider management)
│   ├── AlpacaSettings (Trading account config)
│   ├── AgentBuilder (Agent creation/management)
│   ├── Dashboard (Market overview)
│   └── Various trading components
├── Services
│   ├── alpacaService (Trading API)
│   ├── marketDataService (Mock data)
│   └── aiAnalysisService (Analysis)
├── Utilities
│   ├── storage (LLM, Alpaca, Agent managers)
│   └── validation (Input validation)
└── Contexts
    └── NotificationContext (Alert system)

Supabase Backend
├── Database
│   ├── llm_providers (LLM configs with RLS)
│   ├── agents (Agent configs with RLS)
│   ├── agent_execution_logs (Execution history)
│   └── alpaca_config (Trading account config)
└── Edge Functions (To be implemented)
    ├── Real-time data streaming
    ├── Agent execution engine
    └── Webhook handlers

External APIs
├── Alpaca Markets (Paper & Live Trading)
├── LLM Providers (OpenAI, Claude, etc.)
└── Market Data (Alpaca Data API)
```

---

## Getting Started

### 1. Configure LLM Providers
- Go to Settings → LLM Providers
- Add your preferred LLM provider(s)
- Enter API keys and model names
- Set one as active

### 2. Connect Trading Account
- Go to Settings → Alpaca Trading
- Create account at [Alpaca Markets](https://alpaca.markets)
- Start with Paper Trading for testing
- Enter API Key and Secret Key
- Save configuration

### 3. Create Trading Agents
- Go to Settings → AI Agents
- Click "Create New Agent"
- Select purpose (trading, analysis, etc.)
- Assign LLM provider
- Configure tools the agent can use
- Save agent

### 4. Monitor & Trade
- View Dashboard for market overview
- Monitor agent activities
- Review notifications and alerts
- Track positions and orders

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Lucide React icons
- **State Management**: React Hooks, Context API
- **Form Handling**: React Hook Form, Zod validation
- **Data Fetching**: React Query
- **Virtualization**: @tanstack/react-virtual
- **Build Tool**: Vite
- **Database**: Supabase PostgreSQL
- **APIs**: Alpaca Markets, OpenAI, Anthropic, etc.

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm lint
```

---

## Security Considerations

### Current Implementation
- Client-side localStorage for settings (development mode)
- Input validation and sanitization
- Database RLS policies for user-scoped access

### Recommendations for Production
- Encrypt API keys before storing in localStorage or use Supabase secrets
- Implement secure token refresh mechanism
- Use Edge Functions as API gateway
- Enable CORS restrictions
- Implement rate limiting
- Add comprehensive audit logging
- Regular security audits and penetration testing

---

## Limitations & Known Issues

1. **Mock Data**: Market data is currently simulated, not real-time
2. **Bundle Size**: 664KB (should implement code-splitting)
3. **Agent Execution**: Not yet implemented in production
4. **Data Persistence**: Relies on localStorage (not for production)
5. **Encryption**: API keys stored in plain text (security issue for production)
6. **Testing**: No unit tests or integration tests
7. **Error Handling**: Could be more comprehensive

---

## Roadmap

### Phase 1 (Current)
- ✅ LLM provider configuration
- ✅ Agent builder
- ✅ Alpaca integration setup
- ⏳ Basic agent execution

### Phase 2
- Real-time data streaming
- Agent execution engine
- Performance tracking
- Advanced analytics

### Phase 3
- Backtesting system
- Strategy templates
- Multi-account support
- Advanced compliance

### Phase 4
- Machine learning models
- Automated optimization
- Enterprise features
- API for third-party integrations

---

## Support & Documentation

For detailed information on:
- **LLM Providers**: Check Settings → LLM Providers section
- **Trading**: Visit [Alpaca Markets Docs](https://docs.alpaca.markets)
- **API Keys**: Use official provider documentation for each LLM
- **Troubleshooting**: Check browser console and notification alerts

---

## License

MIT License - See LICENSE file for details

---

## Disclaimer

This is a trading application. Past performance is not indicative of future results. Trading carries risk, including loss of principal. Use paper trading to test strategies before live trading. Always use proper risk management.

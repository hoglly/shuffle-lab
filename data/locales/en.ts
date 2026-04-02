export const en = {
  site: {
    name: "Shuffle Lab",
    tagline: "Small tools for curious minds",
    subtitle: "Developer tools, industrial testing, and everyday utilities",
  },
  home: {
    developerTools: "Developer Tools",
    industrialAndTesting: "Industrial & Testing",
    general: "General",

    wordCounter: "Word Counter",
    wordCounterDesc: "Count words, characters, lines, and reading time",

    jsonFormatter: "JSON Formatter",
    jsonFormatterDesc: "Format, validate, and minify JSON",

    timestampConverter: "Timestamp Converter",
    timestampConverterDesc: "Convert between Unix timestamps and readable dates",

    currencyConverter: "Currency Converter",
    currencyConverterDesc: "Convert currencies with live rates and fallback support",

    excuseGenerator: "Excuse Generator",
    excuseGeneratorDesc: "Generate normal or dramatic excuses",

    scpiSimulator: "SCPI Simulator",
    scpiSimulatorDesc: "Simulate SCPI commands and instrument responses",

    modbusCrc: "Modbus CRC Calculator",
    modbusCrcDesc: "Calculate CRC16 (Modbus) and build RTU frames",

    modbusFrame: "Modbus Frame Builder",
    modbusFrameDesc: "Build Modbus RTU request frames with CRC",

    hexAsciiTool: "HEX ↔ ASCII Converter",
    hexAsciiToolDesc: "Convert between HEX bytes and ASCII text",

    base64Tool: "Base64 Encoder / Decoder",
    base64ToolDesc: "Encode and decode Base64 text",

    uuidTool: "UUID Generator",
    uuidToolDesc: "Generate UUID v4 for development and testing",

    jwtTool: "JWT Decoder",
    jwtToolDesc: "Decode JWT tokens into readable JSON",

    urlTool: "URL Encoder / Decoder",
    urlToolDesc: "Encode and decode URL text",

    hashTool: "Hash Generator",
    hashToolDesc: "Generate MD5, SHA-1, and SHA-256 hashes",

    regexTool: "Regex Tester",
    regexToolDesc: "Test regular expressions on text",
	
	httpStatusTool: "HTTP Status Lookup",
	httpStatusToolDesc: "Look up HTTP status codes and their meanings",
	
	diffTool: "Text Diff Checker",
	diffToolDesc: "Compare two texts and find differences",
	
	modbusExceptionTool: "Modbus Exception Decoder",
	modbusExceptionToolDesc: "Decode Modbus exception responses and error meanings",
	
	modbusResponseTool: "Modbus Response Parser",
	modbusResponseToolDesc: "Parse Modbus RTU response frames and decode register values",
	
	jsonToCsvTool: "JSON to CSV Converter",
	jsonToCsvToolDesc: "Convert JSON arrays into CSV instantly",

    comingSoon: "More tools coming soon",
  },

  common: {
    backToHome: "Back to Home",
    language: "Language",
  },

  wordCounter: {
    title: "Word Counter",
    subtitle: "Count words, characters, lines, and reading time",
    placeholder: "Paste or type your text here...",
    words: "Words",
    characters: "Characters",
    charactersNoSpaces: "Characters (no spaces)",
    lines: "Lines",
    sentences: "Sentences",
    readingTime: "Reading Time",
    min: "min",
  },

  excuseGenerator: {
    title: "Excuse Generator",
    subtitle: "Generate normal or dramatic excuses",
    normal: "Normal",
    dramatic: "Dramatic",
    generate: "Generate Excuse",
    empty: "Click to generate an excuse",
  },

  currencyConverter: {
    title: "Currency Converter",
    subtitle: "Convert currencies with live rates and cached fallback",
    amount: "Amount",
    from: "From",
    to: "To",
    result: "Result",
    rate: "Rate",
    refresh: "Refresh Rates",
    loading: "Loading exchange rates...",
    noData: "No exchange rate data yet",
    lastUpdated: "Last synced",
    sourceDate: "Rate date",
    usingCached: "Using cached rates",
    freshData: "Rates updated",
    failedUsingCached: "Live update failed, using cached rates",
    unavailable: "Exchange rates unavailable",
    swap: "Swap",
    amountPlaceholder: "Enter amount",
	searchCurrency: "Search currency",
	popularCurrencies: "Popular currencies",
	allCurrencies: "All currencies",
	selectCurrency: "Select currency",
	status: "Status",
  },

  jsonFormatter: {
    title: "JSON Formatter",
    subtitle: "Format, validate, and minify JSON",
    input: "Input JSON",
    output: "Output",
    format: "Format",
    minify: "Minify",
    validate: "Validate",
    copy: "Copy",
    clear: "Clear",
    placeholder: "Paste your JSON here...",
    valid: "Valid JSON",
    empty: "Nothing to display yet",
    copySuccess: "Copied to clipboard",
    invalidPrefix: "Invalid JSON:",
  },

  timestampConverter: {
    title: "Timestamp Converter",
    subtitle: "Convert between Unix timestamps and readable dates",
    timestampInput: "Timestamp",
    datetimeInput: "Date & Time",
    localTime: "Local Time",
    utcTime: "UTC Time",
    seconds: "Seconds",
    milliseconds: "Milliseconds",
    detectedUnit: "Detected Unit",
    toTimestamp: "Convert to Timestamp",
    fromTimestamp: "Convert from Timestamp",
    clear: "Clear",
    invalid: "Invalid timestamp or date",
    placeholderTimestamp: "Enter a Unix timestamp...",
    placeholderDatetime: "Select date and time",
    result: "Result",
  },

  base64Tool: {
    title: "Base64 Encoder / Decoder",
    subtitle: "Encode text to Base64 or decode Base64 to text",
    input: "Input",
    output: "Output",
    encode: "Encode",
    decode: "Decode",
    copy: "Copy",
    clear: "Clear",
    placeholder: "Paste your text here...",
    empty: "Nothing to display yet",
    copied: "Copied to clipboard",
    invalid: "Invalid Base64 input",
  },

  modbusCrc: {
    title: "Modbus CRC Calculator",
    subtitle: "Calculate CRC16 and build RTU frames",
    input: "Hex Input",
    placeholder: "e.g. 01 03 00 00 00 0A",
    result: "Result",
    crc: "CRC (Low byte first)",
    frame: "Full Frame",
    calculate: "Calculate",
    clear: "Clear",
    copy: "Copy",
    invalid: "Invalid hex input",
    copied: "Copied to clipboard",
  },

  uuidToolPage: {
    title: "UUID Generator",
    subtitle: "Generate UUID v4 for development and testing",
    generate: "Generate",
    copy: "Copy",
    clear: "Clear",
    empty: "Click generate to create UUID",
    copied: "Copied to clipboard",
  },

  jwt: {
    title: "JWT Decoder",
    subtitle: "Decode JWT into header, payload, and signature",
    input: "JWT Input",
    placeholder: "Paste your JWT here...",
    decode: "Decode",
    clear: "Clear",
    invalid: "Invalid JWT format",
  },

  modbusFrame: {
    title: "Modbus Frame Builder",
    subtitle: "Build Modbus RTU request frames",
    slaveId: "Slave ID",
    functionCode: "Function Code",
    address: "Start Address",
    quantity: "Quantity",
    result: "Result",
    requestPdu: "Request Data",
    fullFrame: "Full RTU Frame",
    calculate: "Build Frame",
    clear: "Clear",
    copy: "Copy",
    invalid: "Invalid input",
    copied: "Copied to clipboard",
    placeholderSlaveId: "e.g. 1",
    placeholderAddress: "e.g. 0",
    placeholderQuantity: "e.g. 10",
  },

  urlTool: {
    title: "URL Encoder / Decoder",
    subtitle: "Encode text for URLs or decode it back",
    input: "Input",
    output: "Output",
    encode: "Encode",
    decode: "Decode",
    copy: "Copy",
    clear: "Clear",
    placeholder: "Paste your text here...",
    empty: "Nothing to display yet",
    copied: "Copied to clipboard",
    invalid: "Invalid URL input",
  },

  hexAsciiTool: {
    title: "HEX ↔ ASCII Converter",
    subtitle: "Convert between HEX and ASCII text",
    input: "Input",
    output: "Output",
    toHex: "ASCII → HEX",
    toAscii: "HEX → ASCII",
    copy: "Copy",
    clear: "Clear",
    placeholder: "Paste HEX or ASCII text here...",
    empty: "Nothing to display yet",
    copied: "Copied to clipboard",
    invalid: "Invalid HEX input",
  },

  hashTool: {
    title: "Hash Generator",
    subtitle: "Generate MD5, SHA-1, and SHA-256 hashes",
    input: "Input",
    output: "Output",
    placeholder: "Enter text here...",
    copy: "Copy",
    clear: "Clear",
    empty: "Nothing to display yet",
    copied: "Copied to clipboard",
    generate: "Generate",
  },

  regexTool: {
    title: "Regex Tester",
    subtitle: "Test regex patterns on text",
    pattern: "Pattern",
    flags: "Flags",
    input: "Test Text",
    result: "Matches",
    test: "Test",
    clear: "Clear",
    placeholderPattern: "e.g. \\d+",
    placeholderText: "Enter text here...",
    noMatch: "No matches found",
    invalid: "Invalid regex pattern",
  },
  
  httpStatusTool: {
	  title: "HTTP Status Lookup",
	  subtitle: "Find the meaning of HTTP status codes",
	  input: "Status Code",
	  result: "Result",
	  placeholder: "Enter code like 404",
	  lookup: "Lookup",
	  clear: "Clear",
	  notFound: "Status code not found",
  },
  
  diffTool: {
	  title: "Text Diff Checker",
	  subtitle: "Compare two texts and highlight differences",
	  inputA: "Text A",
	  inputB: "Text B",
	  result: "Differences",
	  compare: "Compare",
	  clear: "Clear",
	  noDiff: "No differences found",
  },
  
  httpStatusPages: {
	  "404": {
		title: "404 Not Found",
		subtitle: "What it means, why it happens, and how to fix it",
		whatIsTitle: "What is 404 Not Found",
		whatIsBody:
		  "404 Not Found means the server cannot find the page or resource you requested. The URL may be wrong, the page may have been removed, or the link may be outdated.",
		whyTitle: "Why it happens",
		whyBody:
		  "Common reasons include a mistyped URL, a deleted page, a broken internal link, or a resource that was moved without a proper redirect.",
		fixTitle: "How to fix it",
		fixBody:
		  "Check the URL for mistakes, refresh the page, go back to the previous page, or visit the homepage. If you manage the site, add a redirect or restore the missing resource.",
		exampleTitle: "Example",
		exampleBody:
		  "If you open a link like /old-page but that page no longer exists, the server may return 404 Not Found.",
		relatedTitle: "Try the lookup tool",
		relatedBody:
		  "You can also use the HTTP Status Lookup tool to check other status codes.",
		openTool: "Open HTTP Status Lookup",
	  },

	  "500": {
		title: "500 Internal Server Error",
		subtitle: "What it means, why it happens, and how to fix it",
		whatIsTitle: "What is 500 Internal Server Error",
		whatIsBody:
		  "500 Internal Server Error means something went wrong on the server side while processing the request. The server received the request, but it could not complete it successfully.",
		whyTitle: "Why it happens",
		whyBody:
		  "Common reasons include server bugs, misconfigured code, database failures, missing environment variables, or temporary overload on the server.",
		fixTitle: "How to fix it",
		fixBody:
		  "Refresh the page and try again later. If the issue continues, the problem usually needs to be fixed by the website owner or backend developer.",
		exampleTitle: "Example",
		exampleBody:
		  "A server crashes while processing your request or fails to connect to the database, and returns a 500 error instead of a valid response.",
		relatedTitle: "Try the lookup tool",
		relatedBody:
		  "You can also use the HTTP Status Lookup tool to check other status codes.",
		openTool: "Open HTTP Status Lookup",
	  },

	  "403": {
		title: "403 Forbidden",
		subtitle: "What it means, why it happens, and how to fix it",
		whatIsTitle: "What is 403 Forbidden",
		whatIsBody:
		  "403 Forbidden means the server understands your request but refuses to allow access. Unlike 404, the resource may exist, but you are not allowed to open it.",
		whyTitle: "Why it happens",
		whyBody:
		  "This often happens because of missing permissions, authentication problems, blocked IP addresses, or restricted files and directories.",
		fixTitle: "How to fix it",
		fixBody:
		  "Check whether you are logged in, make sure you have the correct permissions, and contact the website owner if necessary.",
		exampleTitle: "Example",
		exampleBody:
		  "Trying to access a restricted admin page, private file, or blocked directory without permission may result in a 403 error.",
		relatedTitle: "Try the lookup tool",
		relatedBody:
		  "You can also use the HTTP Status Lookup tool to check other status codes.",
		openTool: "Open HTTP Status Lookup",
	  },
  },
  
  scpiSimulator: {
	  title: "SCPI Simulator & Runner",
	  subtitle: "Run one or more SCPI commands and simulate instrument responses in the browser",
	  command: "Commands",
	  commandPlaceholder: "Enter a SCPI command, e.g. *IDN?",
	  response: "Response",
	  mapping: "Command Mapping",
	  mappingDesc: "Edit the JSON map to customize command responses",
	  send: "Send",
	  clear: "Clear",
	  copy: "Copy Response",
	  reset: "Reset Preset",
	  notFound: "ERROR: Command not recognized",
	  invalidJson: "Invalid JSON mapping",
	  copySuccess: "Response copied to clipboard",
	  mappingPlaceholder: "Edit command-response pairs here..."
  },
  
  modbusExceptionTool: {
  
  	  title: "Modbus Exception Decoder",
	  subtitle: "Decode Modbus exception frames and understand error meanings",
	  input: "Exception Frame",
	  output: "Decoded Result",
	  placeholder: "e.g. 01 83 02 C0 F1",
	  decode: "Decode",
	  clear: "Clear",
	  copy: "Copy",
	  invalid: "Invalid Modbus exception frame",
	  copied: "Copied to clipboard",
	  slaveId: "Slave ID",
	  functionCode: "Function Code",
	  exceptionCode: "Exception Code",
	  meaning: "Meaning",
	  crc: "CRC Check",
	  ok: "OK",
	  failed: "Failed",
	  unknown: "Unknown exception code"
  },
  
  modbusResponseTool: {
	  title: "Modbus Response Parser",
	  subtitle: "Parse Modbus RTU response frames and decode returned data",
	  input: "Response Frame",
	  output: "Parsed Result",
	  placeholder: "e.g. 01 03 02 00 0A C4 0B",
	  parse: "Parse",
	  clear: "Clear",
	  copy: "Copy",
	  invalid: "Invalid Modbus response frame",
	  copied: "Copied to clipboard",
	  slaveId: "Slave ID",
	  functionCode: "Function Code",
	  byteCount: "Byte Count",
	  dataBytes: "Data Bytes",
	  registers: "Register Values",
	  crc: "CRC Check",
	  ok: "OK",
	  failed: "Failed",
	  unsupported: "Unsupported function code for this parser"
  },
  
  jsonToCsvTool: {
	  title: "JSON to CSV Converter",
	  subtitle: "Convert JSON arrays into CSV format instantly",
	  input: "Input JSON",
	  output: "CSV Output",
	  convert: "Convert",
	  clear: "Clear",
	  copy: "Copy",
	  placeholder: "Paste a JSON array here...",
	  empty: "Nothing to display yet",
	  copied: "Copied to clipboard",
	  invalid: "Invalid JSON input",
	  invalidShape: "Input must be a JSON array of objects",
	  download: "Download CSV",
  },

} as const;
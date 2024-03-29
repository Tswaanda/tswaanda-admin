# Tswaanda Marketplace Dashboard
Dashboard for Tswaanda Marketplace

Tswaanda Dashboard is a web application for managing and monitoring data related to Tswaanda Marketplace services. 
The application is a Dapp consisting of a frontend canister built using ReactJS and a backend canister built using Motoko. 
 
## Getting Started

To get started with Tswaanda Dashboard, follow these instructions:

## Prerequisites

- [X] DFX(Version 0.14.1)
- [X] NodeJS(Version 16 or higher)
- [X] Tswaanda Marketplace (https://github.com/renegadec/marketplace)

## Download & Installation

#### Step 1: Download the repo or clone it using your terminal.

```bash 
git clone https://github.com/renegadec/tswaanda-backend.git

```

#### Step 2: Navigate to the `tswaanda` folder and install the dependencies:

```bash
cd tswaanda-backend/tswaanda
npm install
```

#### Step 3: Run the npm install command to install libraries and packages.

```bash
npm install

mops install
```
#### Step 4: Start DFX locally by running the following command

```bash
npm run dfx
```

#### Step 5: Deploy the canisters by running the following command

```bash
npm run deploy
```

#### Step 6: Run the front-end

```bash
npm start
```

#### Step 6: If you want to run with the websockets locally, Make sure you have the Rust toolchain installed. You can find instructions [here](https://www.rust-lang.org/tools/install), and then clone the gateway repo:

```bash
git clone https://github.com/omnia-network/ic-websocket-gateway.git
```

#### Step 7: Navigate to the `ic-websocket-gateway` folder and run:

```bash
cargo run
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Conclusion

If you have any challenges you can create or ask questions in the Issues tab. We are constantly updating the software and always check for updates if anything breaks at any point.

## License

[MIT](https://choosealicense.com/licenses/mit/)
# Voting System

Este repositorio contiene un sistema de votación descentralizado implementado en Solidity. El contrato permite la creación de propuestas y otorga a una lista de direcciones la capacidad de votar o delegar su voto a otro usuario. También incluye un conjunto de pruebas automatizadas utilizando Hardhat y Chai para garantizar su correcto funcionamiento.

## 📌 Características
- Creación de propuestas de votación.
- Asignación de derechos de voto a una lista de direcciones.
- Posibilidad de votar por una propuesta específica.
- Delegación de votos a otro usuario.
- Registro de los votos emitidos.

---

## 📋 Requisitos previos
Asegúrate de tener instalado lo siguiente en tu máquina:

- [Node.js](https://nodejs.org/) (versión recomendada: 16 o superior)
- [Hardhat](https://hardhat.org/) (framework de desarrollo para Ethereum)
- [Git](https://git-scm.com/)

Para instalar Hardhat, ejecuta:
```sh
npm install --save-dev hardhat
```

---

## 🚀 Instalación y configuración
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/jvsalinas85/voting-system.git
   cd voting-system
   ```

2. Instalar las dependencias del proyecto:
   ```sh
   npm install
   ```

3. Compilar los contratos:
   ```sh
   npx hardhat compile
   ```

4. Desplegar el contrato en una red local:
   ```sh
   npx hardhat node
   ```
   En otra terminal, ejecutar:
   ```sh
   npx hardhat run scripts/deploy.js --network localhost
   ```

---

## 🧪 Pruebas
Este contrato incluye pruebas automatizadas con Hardhat y Chai. Para ejecutarlas, usa:
```sh
npx hardhat test
```
Si todo funciona correctamente, deberías ver los resultados de las pruebas en la terminal.

---

## 📜 Descripción del contrato
El contrato `Voting.sol` permite gestionar un sistema de votaciones con las siguientes funciones:

- `constructor(string[] memory _proposalNames, address[] memory _voters)`: Inicializa el contrato con una lista de propuestas y direcciones de votantes autorizados.
- `vote(address _voter, uint256 _proposalIndex)`: Permite a un votante emitir su voto por una propuesta específica.
- `delegateVote(address _to)`: Permite a un votante delegar su voto a otra dirección.
- `getProposal(uint256 _index)`: Retorna la información de una propuesta.
- `getWinner()`: Devuelve la propuesta ganadora basada en el conteo de votos.

---

## 📌 Contacto
Si tienes preguntas o sugerencias, no dudes en abrir un issue en el repositorio o contactarme en [jvsalinas85@gmail.com].

---

¡Gracias por usar el sistema de votaciones! 🎉


# Voting System

This repository contains a decentralized voting system implemented in Solidity. The contract allows the creation of proposals and grants a list of addresses the ability to vote or delegate their vote to another user. It also includes a set of automated tests using Hardhat and Chai to ensure its correct functionality.

## 📌 Features
- Creation of voting proposals.
- Assignment of voting rights to a list of addresses.
- Ability to vote for a specific proposal.
- Delegation of votes to another user.
- Recording of cast votes.

---

## 📋 Prerequisites
Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (recommended version: 16 or higher)
- [Hardhat](https://hardhat.org/) (Ethereum development framework)
- [Git](https://git-scm.com/)

To install Hardhat, run:
```sh
npm install --save-dev hardhat
```

---

## 🚀 Installation and Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/jvsalinas85/voting-system.git
   cd voting-system
   ```

2. Install project dependencies:
   ```sh
   npm install
   ```

3. Compile the contracts:
   ```sh
   npx hardhat compile
   ```

4. Deploy the contract to a local network:
   ```sh
   npx hardhat node
   ```
   In another terminal, run:
   ```sh
   npx hardhat run scripts/deploy.js --network localhost
   ```

---

## 🧪 Testing
This contract includes automated tests with Hardhat and Chai. To run them, use:
```sh
npx hardhat test
```
If everything works correctly, you should see the test results in the terminal.

---

## 📜 Contract Description
The `Voting.sol` contract manages a voting system with the following functions:

- `constructor(string[] memory _proposalNames, address[] memory _voters)`: Initializes the contract with a list of proposals and authorized voter addresses.
- `vote(address _voter, uint256 _proposalIndex)`: Allows a voter to cast their vote for a specific proposal.
- `delegateVote(address _to)`: Allows a voter to delegate their vote to another address.
- `getProposal(uint256 _index)`: Returns information about a proposal.
- `getWinner()`: Returns the winning proposal based on the vote count.

---

## 📌 Contact
If you have any questions or suggestions, feel free to open an issue in the repository or contact me at [jvsalinas85@gmail.com].

---

Thank you for using the voting system! 🎉


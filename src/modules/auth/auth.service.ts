import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import Web3 from 'web3';  // Import Web3
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { UserService } from '../user/user.service';
import CommonUtil from '../../utils/commons.util';
import { loginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly INITIAL_TOKEN_ALLOCATION = 1000;  // Hardcoded for end users

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService // Inject JwtService
  ) {}

  // Register a new user
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, full_name, wallet_address } = registerUserDto;

    // Check if the email is already registered
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = this.userRepository.create({
      email,
      full_name,
      password,
      wallet_address,
      token_balance: this.INITIAL_TOKEN_ALLOCATION, // Set initial token balance
    });

    // Save the user to the database
    const savedUser = await this.userRepository.save(newUser);

    // If wallet address is provided, allocate tokens via smart contract
    // if (wallet_address) {
    //   await this.allocateTokensToWallet(wallet_address, this.INITIAL_TOKEN_ALLOCATION);
    // }

    return savedUser;
  }

  // Validate user credentials for login
  // async validateUser(email: string, password: string): Promise<User | null> {
  //   const user = await this.userRepository.findOne({ where: { email } });
  //   if (!user) {
  //     return null;
  //   }

  //   const isPasswordMatching = await bcrypt.compare(password, user.password);
  //   if (!isPasswordMatching) {
  //     return null;
  //   }

  //   return user;
  // }

  // Login and generate JWT token for user
  async login(payload: loginDto) {
    
    try {
      console.log("Payload: ", payload);

      // Check if user exists
      const user = await this.userService.getUserByEmail(payload.email);
      if (!user) {
        throw new HttpException(
          `User with email: ${payload.email} does not exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate password
      const isValid = await user.isValidPassword(payload.password);
      console.log("isValid: ", isValid);
      if (!isValid) {
        throw new HttpException("Incorrect email or password", HttpStatus.BAD_REQUEST);
      }

      // Generate token using CommonUtil
      const expiresIn = this.configService.getOrThrow("JWT_EXPIRES_IN");
      const secretKey = this.configService.getOrThrow("JWT_SECRET");
      const token = await CommonUtil.generateToken({ id: user.id }, expiresIn, secretKey);

      // Return user and token
      return { 
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_active: user.is_active,
          is_verified: user.is_verified,
          token_balance: user.token_balance,
          created_at: user.created_at,
          updated_at: user.updated_at,
          last_login_at: new Date(),
        },
        token 
      };
    } catch (error) {
      console.error("authservice :: login error \n %o", error);
      throw error;
    }
  }


  // Interact with Ethereum contract using web3.js
  private async allocateTokensToWallet(walletAddress: string, amount: number) {
    try {
      const network = this.configService.get<string>('NETWORK') || 'sepolia';
      const infuraApiKey = this.configService.get<string>('INFURA_API_KEY');
      const web3 = new Web3(new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${infuraApiKey}`));

      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);

      if (!privateKey || !privateKey.startsWith('0x') || privateKey.length !== 66) {
        throw new Error('Invalid private key format');
      }

      web3.eth.accounts.wallet.add(account);

      const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
      const contractABI = [
        {
          "constant": false,
          "inputs": [
            { "name": "to", "type": "address" },
            { "name": "value", "type": "uint256" }
          ],
          "name": "transfer",
          "outputs": [{ "name": "", "type": "bool" }],
          "type": "function"
        }
      ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const data = contract.methods.transfer(walletAddress, web3.utils.toWei(amount.toString(), 'ether')).encodeABI();

       // Estimate gas for the transaction
    const isEIP1559 = true; 

       // Get gas estimation
    const gasEstimate = await web3.eth.estimateGas({
      from: account.address,
      to: contractAddress,
      data: data,
});
       
       let tx: any; // Transaction object
       
       if (isEIP1559) {
         // EIP-1559 transaction (type 2)
         const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // Customize as needed
         const maxFeePerGas = web3.utils.toWei('100', 'gwei'); // Customize as needed
       
         tx = {
           from: account.address,
           to: contractAddress,
           gas: gasEstimate,
           maxPriorityFeePerGas: maxPriorityFeePerGas,
           maxFeePerGas: maxFeePerGas,
           data: data
         };
       } else {
         // Legacy transaction (type 0)
         const gasPrice = await web3.eth.getGasPrice(); // Get legacy gas price
       
         tx = {
           from: account.address,
           to: contractAddress,
           gas: gasEstimate,
           gasPrice: gasPrice,
           data: data
         };
       }

      // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

      // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);


    console.log('Transaction receipt:', receipt);
  } catch (error) {
    console.error('Failed to allocate tokens to wallet:', error);
    throw new BadRequestException('Failed to allocate tokens to the wallet');
  }
  }
}

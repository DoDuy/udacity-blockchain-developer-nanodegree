pragma solidity ^0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    address private contractOwner;          // Account used to deploy contract

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;        
        address airline;
    }
    mapping(bytes32 => Flight) private flights;

    FlightSuretyData flightSuretyData;
    // Multi party consensus
    uint256 public constant AIRLINE_MINIMUM_FUND = 10 ether;
    uint8 public constant MULTIPARTY_MIN_AIRLINES = 4;
    uint8 public constant MULTIPARTY_MIN_PERCENTAGE = 50;

    struct AirelineVote {
        mapping(address => bool) voter;
        uint256 voteCount;
    }
    mapping(address => AirelineVote) airlineVotes;

    // Passengers
    uint256 public constant INSURANCE_PRICE_LIMIT = 1 ether;
    uint256 public constant INSURANCE_CREDIT_PERCENTAGE = 150; 
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
         // Modify to call data contract's status
        require(isOperational(), "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the "ActiveAirline" account to be the actived airline
    */
    modifier requireIsActiveAirline()
    {
        require(flightSuretyData.isRegistered(msg.sender), "Airline is not registered");
        require(flightSuretyData.getFunded(msg.sender) >= AIRLINE_MINIMUM_FUND, "Airline funded is not enough");
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor
                                (
                                    address flightSuretyDataContract
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        flightSuretyData = FlightSuretyData(flightSuretyDataContract);
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational() 
                            public 
                            view
                            returns(bool) 
    {
        return flightSuretyData.isOperational();  // Modify to call data contract's status
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /********************************************************************************************/
    // Airline
   /**
    * @dev Add an airline to the registration queue
    *
    */   
    function registerAirline(address account, string name)
                            external
                            requireIsOperational
                            requireIsActiveAirline
                            returns(bool success, uint256 votes)
    {
        require(!flightSuretyData.isRegistered(account), "Airline is already register");
        require(!airlineVotes[account].voter[msg.sender], "Airline sender already vote the new Airline address");

        airlineVotes[account].voter[msg.sender] = true;
        airlineVotes[account].voteCount = airlineVotes[account].voteCount.add(1);

        if (flightSuretyData.getAirlineCount() <= MULTIPARTY_MIN_AIRLINES) {
            flightSuretyData.registerAirline(account, name, true);
        } else if (uint256(1000).mul(airlineVotes[account].voteCount).div(flightSuretyData.getAirlineCount()) >= uint256(10).mul(MULTIPARTY_MIN_PERCENTAGE)) {
                flightSuretyData.registerAirline(account, name, true);
        } else return (false, airlineVotes[account].voteCount);
        
        return (true, airlineVotes[account].voteCount);
    }

    /**
    * @dev Add an airline to the registration queue
    *
    */   
    function fundAirline()
                        external
                        payable
                        requireIsOperational
    {
        require(msg.value > 0, "Dont send money to fund");
        require(flightSuretyData.isRegistered(msg.sender), "Sender need is an airline");

        address(flightSuretyData).transfer(msg.value);
        flightSuretyData.fundAirline(msg.sender, msg.value);
    }

    /********************************************************************************************/
    // Passenger
   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buyInsurance(address airline, string flight, uint256 timestamp)
                            external
                            payable
                            requireIsOperational
    {
        require(msg.sender == tx.origin, "Not allow contract call");
        require(msg.value > 0, 'User do not fund');
        require(flightSuretyData.getInsurance(msg.sender, airline, flight, timestamp) <= INSURANCE_PRICE_LIMIT, "Already buy limit insurance for this flight");
        
        if (flightSuretyData.getInsurance(msg.sender, airline, flight, timestamp).add(msg.value) > INSURANCE_PRICE_LIMIT) {
            address(flightSuretyData).transfer(INSURANCE_PRICE_LIMIT.sub(flightSuretyData.getInsurance(msg.sender, airline, flight, timestamp)));
            flightSuretyData.buyInsurance(msg.sender, airline, flight, timestamp, INSURANCE_PRICE_LIMIT.sub(flightSuretyData.getInsurance(msg.sender, airline, flight, timestamp)));
            msg.sender.transfer(flightSuretyData.getInsurance(msg.sender, airline, flight, timestamp).add(msg.value).sub(INSURANCE_PRICE_LIMIT));
        } else {
            address(flightSuretyData).transfer(msg.value);
            flightSuretyData.buyInsurance(msg.sender, airline, flight, timestamp, msg.value);
        }
    }

    // /**
    //  *  @dev Credits payouts to insurees
    // */
    // function creditInsurees(address airline, string flight, uint256 timestamp)
    //                         external
    //                         requireIsOperational
    // {
    //     flightSuretyData.creditInsurees(airline, flight, timestamp, INSURANCE_CREDIT_PERCENTAGE);
    // }

    function getPassengerCredit() external view returns(uint256){
        return flightSuretyData.getPassengerCredit(msg.sender);
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function payInsuree()
                external
                payable
                requireIsOperational
    {
        require(msg.sender == tx.origin, "Not allow contract call");
        flightSuretyData.payInsuree(msg.sender);
    }

    /********************************************************************************************/
    // Flight
   /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight(string flight, uint256 timestamp)
                            external
                            requireIsOperational
                            requireIsActiveAirline
    {
        flightSuretyData.registerFlight(msg.sender, flight, timestamp, STATUS_CODE_UNKNOWN);
    }
    
   /**
    * @dev Called after oracle has updated flight status
    *
    */  
    function processFlightStatus(address airline,
                                string flight,
                                uint256 timestamp,
                                uint8 status_code)
                                internal
                                requireIsOperational
    {
        flightSuretyData.processFlightStatus(airline, flight, timestamp, status_code);
        if (status_code == STATUS_CODE_LATE_AIRLINE) {
            flightSuretyData.creditInsurees(airline, flight, timestamp, INSURANCE_CREDIT_PERCENTAGE);
        }
    }

    function getFlightStatus(address airline,
                                string flight,
                                uint256 timestamp)
                                external
                                view
                                returns(uint8)
    {
        return flightSuretyData.getFlightStatus(airline, flight, timestamp);
    }


    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus
                        (
                            address airline,
                            string flight,
                            uint256 timestamp                            
                        )
                        external
    {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        oracleResponses[key] = ResponseInfo({
                                                requester: msg.sender,
                                                isOpen: true
                                            });

        emit OracleRequest(index, airline, flight, timestamp);
    } 


// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    function registerOracle
                            (
                            )
                            external
                            payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });
    }

    function getMyIndexes
                            (
                            )
                            view
                            external
                            returns(uint8[3])
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        external
    {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey
                        (
                            address airline,
                            string flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
                            (                       
                                address account         
                            )
                            internal
                            returns(uint8[3])
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
                            (
                                address account
                            )
                            internal
                            returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

// endregion

}   

contract FlightSuretyData {
    // General
    function isOperational() public view returns(bool);
    // Airline
    function registerAirline(address airlineAdress, string airlineName, bool isRegistered) external;
    function fundAirline(address account, uint256 value) external;
    function isRegistered(address account) external view returns(bool);
    function getFunded(address account) external view returns(uint256);
    function getAirlineCount() external view returns(uint256);

    // Passenger
    function buyInsurance(address passenger, address airline, string flight, uint256 timestamp, uint256 value) external;
    function getInsurance(address passenger, address airline, string flight, uint256 timestamp) external view returns(uint256);
    function creditInsurees(address airline, string flight, uint256 timestamp, uint256 multiplier_percentage) external;
    function getPassengerCredit(address passenger) external view returns(uint256);
    function payInsuree(address passenger) external payable;

    // Flight
    function registerFlight(address airline, string flight, uint256 timestamp, uint8 status_code) external;
    function processFlightStatus(address airline, string flight, uint256 timestamp, uint8 status_code) external;
    function getFlightStatus(address airline, string flight, uint256 timestamp) external view returns(uint8);
}
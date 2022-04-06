pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    struct Airline {
        bool isRegistered;
        uint256 funded;
    }
    mapping(address => Airline) private airlines;
    uint256 private airlineCount = 0;

    mapping(address => bool) private authorizedContracts;

    // Passenger
    struct Passenger{
        mapping(bytes32 => uint256) boughtFlight;
        uint256 credit;
    }
    mapping (address => Passenger) passengersFunded;

    // Flights
    struct Flight {
        address[] insuredPassenger;
        bool isRegistered;
        uint8 statusCode;
        uint256 timestamp;
        address airline;
        string flight;
    }
    mapping(bytes32 => Flight) private flights;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event AirlineRegistered(address airline, bool isRegistered);
    event AirlineFunded(address addr, uint256 amount);
    event FlightRegistered(address airline, string flight, uint256 timestamp, uint8 statusCode);
    event BoughtInsurance(address airline, string flight, uint256 timestamp, address passenger, uint256 amount);
    event FlightStatusUpdated(address airline, string flight, uint256 timestamp, uint8 statusCode);
    event InsureeCredited(address passenger, uint256 amount);
    event PassengerWithdrawn(address passenger, uint256 amount);

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(address airlineAdress) 
                public 
    {
        contractOwner = msg.sender;
        airlines[airlineAdress] = Airline({
            isRegistered: true,
            funded: 0
        });
        airlineCount++;

        emit AirlineRegistered(airlineAdress, true);
    }

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
        require(operational, "Contract is currently not operational");
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
    * @dev Modifier that requires the "authorizedContract" account to be the function caller
    */
    modifier requireCallerAuthorized()
    {
        require(authorizedContracts[msg.sender], "Caller is not authorized contract");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) 
                            external
                            requireContractOwner 
    {
        // require(operational != mode, "Operational and new mode is not changed");
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /********************************************************************************************/
    // Airline
   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(address airlineAdress, bool isRegistered)
                            external
                            requireIsOperational
                            requireCallerAuthorized
    {
        require(airlineAdress != address(0), "invalid address");
        require(airlines[airlineAdress].isRegistered != isRegistered, "Airline isRegister status is not changed");
        airlines[airlineAdress].isRegistered = isRegistered;
        if (isRegistered){
            airlineCount++;
        } else {
            airlineCount--;
        }

        emit AirlineRegistered(airlineAdress, isRegistered);
    }

    function fundAirline(address account, uint256 value)
                            external
                            requireIsOperational
                            requireCallerAuthorized
    {
        airlines[account].funded = airlines[account].funded.add(value);

        emit AirlineFunded(account, value);
    }

    function getFunded(address account)
                        external
                        view
                        requireCallerAuthorized
                        returns(uint256) 
    {
        return airlines[account].funded;
    }

    function isRegistered(address account)
                        external
                        view
                        requireCallerAuthorized
                        returns(bool) 
    {
        return airlines[account].isRegistered;
    }

    /**
    * @dev Get number of Airline
    *
    */   
    function getAirlineCount() 
                        external 
                        view 
                        returns(uint256)
    {
        return airlineCount;
    }

    /********************************************************************************************/
    // Passenger
   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buyInsurance(address passenger, address airline, string flight, uint256 timestamp, uint256 value)
                            external
                            requireIsOperational
                            requireCallerAuthorized
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(flights[flightKey].isRegistered, "Flight do not exist");
        passengersFunded[passenger].boughtFlight[flightKey] = passengersFunded[passenger].boughtFlight[flightKey].add(value);
        flights[flightKey].insuredPassenger.push(passenger);

        emit BoughtInsurance(airline, flight, timestamp, passenger, value);
    }

    function getInsurance(address passenger, address airline, string flight, uint256 timestamp)
                            external
                            view
                            requireIsOperational
                            returns(uint256)
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        return passengersFunded[passenger].boughtFlight[flightKey];
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees(address airline, string flight, uint256 timestamp, uint256 multiplier_percentage)
                                external
                                requireIsOperational
                                requireCallerAuthorized
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(flights[flightKey].isRegistered, "Flight do not exist");
        for (uint i = 0; i < flights[flightKey].insuredPassenger.length; i++) {
            address passenger = flights[flightKey].insuredPassenger[i];
            uint256 credit = passengersFunded[passenger].boughtFlight[flightKey].mul(multiplier_percentage).div(100);
            passengersFunded[passenger].boughtFlight[flightKey] = 0;
            passengersFunded[passenger].credit = credit;

            emit InsureeCredited(passenger, credit);
        }
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function payInsuree(address passenger)
                external
                payable
                requireIsOperational
                requireCallerAuthorized
    {
        require(passengersFunded[passenger].credit > 0, "Passenger have no money");
        uint256 credit = passengersFunded[passenger].credit;
        passengersFunded[passenger].credit = 0;
        passenger.transfer(credit);

        emit PassengerWithdrawn(passenger, credit);
    }

    /********************************************************************************************/
    // Flight
   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                            )
                            public
                            payable
                            requireIsOperational
    {
    }

    function registerFlight(address airline, string flight, uint256 timestamp, uint8 status_code)
                            external
                            requireIsOperational
                            requireCallerAuthorized
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(!flights[flightKey].isRegistered, "Flight exist");
        flights[flightKey] = Flight({
            insuredPassenger: new address[](0),
            isRegistered: true,
            statusCode: status_code,
            timestamp: timestamp,
            airline: airline,
            flight: flight
        });
        
        emit FlightRegistered(airline, flight, timestamp, status_code);
    }

    function processFlightStatus(address airline,
                                string flight,
                                uint256 timestamp,
                                uint8 status_code)
                                external
                                requireIsOperational
                                requireCallerAuthorized
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(flights[flightKey].isRegistered, "Flight do not exist");
        require(flights[flightKey].statusCode != status_code, "Status code is the same");
        flights[flightKey].statusCode = status_code;

        emit FlightStatusUpdated(airline, flight, timestamp, status_code);
    }

    function getFlightStatus(address airline,
                            string flight,
                            uint256 timestamp)
                            external
                            view
                            requireIsOperational
                            returns(uint8)
    {
        bytes32 flightKey = getFlightKey(airline, flight, timestamp);
        require(flights[flightKey].isRegistered, "Flight do not exist");
        return flights[flightKey].statusCode;
    }

    function getFlightKey(address airline,
                        string memory flight,
                        uint256 timestamp)
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }

    
    /**
    * @dev 3 functions for controlling AuthorizedContracts.
    *
    */
    function isAuthorizedCaller(address newContract) 
                            external 
                            view
                            returns(bool)
    {
        return authorizedContracts[newContract];
    }

    function authorizeCaller(address newAppContract) 
                            external 
                            requireContractOwner
                            requireIsOperational
    {
        authorizedContracts[newAppContract] = true;
    }

    function deauthorizeCaller(address authorizedContract) 
                            external 
                            requireContractOwner
                            requireIsOperational
    {
        delete authorizedContracts[authorizedContract];
    }
}


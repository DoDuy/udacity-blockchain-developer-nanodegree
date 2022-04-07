
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {
        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    
        DOM.elid('register-airline').addEventListener('click', () => {
            let address = DOM.elid('airline-address').value;
            let name = DOM.elid('airline-name').value;
            contract.registerAirline(address, name, (error, result) => {
                console.log(error)
                log('Airline', 'Register Airline', [ { error: error, result: result} ]);
            });
        })

        DOM.elid('fund-airline').addEventListener('click', () => {
            let amount = DOM.elid('funding-amount').value;
            contract.fundAirline(amount, (error, result) => {
                console.log(error)
                log('Airline', 'Fund Airline', [ { error: error, result: result} ]);
            });
        })

        DOM.elid('register-flight').addEventListener('click', () => {
            let flightCode = DOM.elid('flight-number').value;
            contract.registerFlight(flightCode, (error, result, airline, flightCode, timestamp) => {
                console.log(error)
                log('Airline', 'Register flight', [ { error: error, result: result, 
                    notes: `Airline: ${airline}, flight: ${flightCode}, timestamp: ${timestamp}`}]);
            });
        })

        DOM.elid('buyInsurance').addEventListener('click', () => {
            let adress = DOM.elid('buyInsurance-adress').value;
            let code = DOM.elid('buyInsurance-code').value;
            let timestamp = DOM.elid('buyInsurance-timestamp').value;
            let amount = DOM.elid('buyInsurance-amount').value;
            contract.buyInsurance(adress, code, timestamp, amount, (error, result, passenger, amount) => {
                console.log(error)
                log('Passenger', 'Buy Insurance', [ { error: error, result: result, 
                    notes: `Passenger: ${passenger}, buy insurance: ${amount}eth`}]);
            });
        })

        DOM.elid('submit-oracle').addEventListener('click', () => {
            let adress = DOM.elid('fetchFlightStatus-adress').value;
            let code = DOM.elid('fetchFlightStatus-code').value;
            let timestamp = DOM.elid('fetchFlightStatus-timestamp').value;
            contract.fetchFlightStatus(adress, code, timestamp, (error, result) => {
                console.log(error)
                log('Passenger', 'Fetch Flight Status', [ { error: error, result: result, 
                    notes: `sent`}]);
            });
        })

        DOM.elid('refresh-funds').addEventListener('click', () => {
            contract.getPassengerCredit((error, result) => {
                console.log(error)
                let amount = 0;
                if (!error) {
                    amount = contract.web3.utils.fromWei(result, 'ether')
                }
                log('Passenger', 'Withdrawable Funds', [ { error: error, notes: `Your withdrawable Funds: ${amount} ETH`}]);
            });
        })

        DOM.elid('withdraw-funds').addEventListener('click', () => {
            contract.payInsuree((error, result) => {
                console.log(error)
                log('Passenger', 'Withdraw funds', [ { error: error, result: result}]);
            });
        })
    
    });
})();


function log(title, description, results) {
    let displayDiv = DOM.elid("display-log");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        if (result.error) {
            let row = section.appendChild(DOM.div({className:'row'}));
            row.appendChild(DOM.div({className: 'col-sm-4 field'}, "Error: "));
            row.appendChild(DOM.div({className: 'col-sm-8 field-value-fail'}, String(result.error.message)));
            section.appendChild(row);
        } 
        if (result.result) {
            let row = section.appendChild(DOM.div({className:'row'}));
            row.appendChild(DOM.div({className: 'col-sm-4 field'}, "Transaction: "));
            row.appendChild(DOM.div({className: 'col-sm-8 field-value-success'}, String(result.result)));
            section.appendChild(row);
        }

        if (result.notes) {
            let row = section.appendChild(DOM.div({className:'row'}));
            row.appendChild(DOM.div({className: 'col-sm-4 field'}, "Note: "));
            row.appendChild(DOM.div({className: 'col-sm-8 field-value-note'}, String(result.notes)));
            section.appendChild(row);
        }
    })
    displayDiv.append(section);

}

function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}








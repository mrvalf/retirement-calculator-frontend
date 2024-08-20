import {useEffect, useState} from 'react';
import axios from 'axios';
import MainResults from "./MainResults.jsx";
import {Navigate, useNavigate} from "react-router-dom";

const RetirementCalculator = () => {
    const [currentYear, setCurrentYear] = useState(2024);
    const [birthYear, setBirthYear] = useState(2004);
    const [retirementAge, setRetirementAge] = useState(65);
    const [marketReturn, setMarketReturn] = useState(0.08);
    const [marketStandardDeviation, setMarketStandardDeviation] = useState(0.09);
    const [expenseRateInRetirement, setExpenseRateInRetirement] = useState(100000);
    const [numberOfTrails, setNumberOfTrails] = useState(100);
    const [numberOfYearsInRetirement, setNumberOfYearsInRetirement] = useState(40);
    const [rothIraBalance, setRothIraBalance] = useState(0);
    const [rothIraContribution, setRothIraContribution] = useState(0);
    const [traditionalIraBalance, setTraditionalIraBalance] = useState(0);
    const [traditionalIraContribution, setTraditionalIraContribution] = useState(0);
    const [roth401kBalance, setRoth401kBalance] = useState(0);
    const [roth401kContribution, setRoth401kContribution] = useState(0);
    const [traditional401kBalance, setTraditional401kBalance] = useState(0);
    const [traditional401kContribution, setTraditional401kContribution] = useState(0);
    const [personalInvestmentBalance, setPersonalInvestmentBalance] = useState(0);
    const [personalInvestmentContribution, setPersonalInvestmentContribution] = useState(0);
    const [result, setResult] = useState(null);
    const [percentile, setPercentile] = useState(0);
    const [percentileButton, setPercentileButton] = useState(0);


    useEffect(() => {
        getInitialParameters();
    }, []);

    const navigate = useNavigate();

    if (!localStorage.getItem('jwtToken')) {
        return <Navigate to="/"/>
    }

    const logOut = () => {
        localStorage.removeItem('jwtToken');
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData= {
            currentYear,
            birthYear,
            retirementAge,
            marketReturn,
            marketStandardDeviation,
            expenseRateInRetirement,
            numberOfTrails,
            numberOfYearsInRetirement,
            accounts: {
                rothIra: {
                    balance: rothIraBalance,
                    contribution: rothIraContribution,
                },
                traditionalIra: {
                    balance: traditionalIraBalance,
                    contribution: traditionalIraContribution,
                },
                roth401k: {
                    balance: roth401kBalance,
                    contribution: roth401kContribution,
                },
                traditional401k: {
                    balance: traditional401kBalance,
                    contribution: traditional401kContribution,
                },
                personalInvestment: {
                    balance: personalInvestmentBalance,
                    contribution: personalInvestmentContribution,
                },
            },
        };

        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://localhost:8080/retirementTool/calculate',
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setResult(response.data);
        } catch (error) {
            console.error('Error calculating retirement:', error.response || error.message || error);
            localStorage.removeItem('jwtToken');
            navigate("/");
            alert('Invalid token');
        }
    };

    const getInitialParameters = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await axios.get(
                'http://localhost:8080/retirementTool/initialRetirementParameters',
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            if (response.data !== "") {
                const data = response.data;
                setCurrentYear(data.currentYear);
                setBirthYear(data.birthYear);
                setRetirementAge(data.retirementAge);
                setMarketReturn(data.marketReturn);
                setMarketStandardDeviation(data.marketStandardDeviation);
                setExpenseRateInRetirement(data.expenseRateInRetirement);
                setNumberOfTrails(data.numberOfTrails);
                setNumberOfYearsInRetirement(data.numberOfYearsInRetirement);
                setRothIraBalance(data.accounts.rothIra.balance);
                setRothIraContribution(data.accounts.rothIra.contribution);
                setTraditionalIraBalance(data.accounts.traditionalIra.balance);
                setTraditionalIraContribution(data.accounts.traditionalIra.contribution);
                setRoth401kBalance(data.accounts.roth401k.balance);
                setRoth401kContribution(data.accounts.roth401k.contribution);
                setTraditional401kBalance(data.accounts.traditional401k.balance);
                setTraditional401kContribution(data.accounts.traditional401k.contribution);
                setPersonalInvestmentBalance(data.accounts.personalInvestment.balance);
                setPersonalInvestmentContribution(data.accounts.personalInvestment.contribution);
            }
        } catch (error) {
            console.error('Error retrieving initial parameters:', error.response || error.message || error);
            localStorage.removeItem('jwtToken');
            navigate("/");
            alert('Error retrieving initial parameters');
        }
    }



    return (
        <div>
            <button onClick={() => logOut()}>Logout</button>

            <h2>Retirement Calculator</h2>
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div>
                        <h3>Retirement Settings</h3>
                        <div className="verticalSpacer">
                            <label>Current Year:</label>
                            <input type="number" value={currentYear}
                                   onChange={(e) => setCurrentYear(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Birth Year:</label>
                            <input type="number" value={birthYear}
                                   onChange={(e) => setBirthYear(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Retirement Age:</label>
                            <input type="number" value={retirementAge}
                                   onChange={(e) => setRetirementAge(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Market Return:</label>
                            <input type="number" step="0.01"
                                   value={marketReturn}
                                   onChange={(e) => setMarketReturn(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Market Standard Deviation:</label>
                            <input type="number" step="0.01"
                                   value={marketStandardDeviation}
                                   onChange={(e) => setMarketStandardDeviation(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Expense Rate In Retirement:</label>
                            <input type="number" value={expenseRateInRetirement}
                                   onChange={(e) => setExpenseRateInRetirement(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Number of Trails:</label>
                            <input type="number" value={numberOfTrails}
                                   onChange={(e) => setNumberOfTrails(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Number of Years In Retirement:</label>
                            <input type="number"
                                   value={numberOfYearsInRetirement}
                                   onChange={(e) => setNumberOfYearsInRetirement(e.target.value)}/>
                        </div>
                    </div>
                    <div className="spacer30px"/>
                    <div>
                        <h3>Account Balances and Contributions</h3>
                        <div className="verticalSpacer">
                            <label>Roth IRA Balance:</label>
                            <input type="number" value={rothIraBalance}
                                   onChange={(e) => setRothIraBalance(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Roth IRA Contribution:</label>
                            <input type="number" value={rothIraContribution}
                                   onChange={(e) => setRothIraContribution(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Traditional IRA Balance:</label>
                            <input type="number" value={traditionalIraBalance}
                                   onChange={(e) => setTraditionalIraBalance(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Traditional IRA Contribution:</label>
                            <input type="number"
                                   value={traditionalIraContribution}
                                   onChange={(e) => setTraditionalIraContribution(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Roth 401k Balance:</label>
                            <input type="number" value={roth401kBalance}
                                   onChange={(e) => setRoth401kBalance(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Roth 401k Contribution:</label>
                            <input type="number" value={roth401kContribution}
                                   onChange={(e) => setRoth401kContribution(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Traditional 401k Balance:</label>
                            <input type="number" value={traditional401kBalance}
                                   onChange={(e) => setTraditional401kBalance(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Traditional 401k Contribution:</label>
                            <input type="number"
                                   value={traditional401kContribution}
                                   onChange={(e) => setTraditional401kContribution(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Personal Investment Balance:</label>
                            <input type="number"
                                   value={personalInvestmentBalance}
                                   onChange={(e) => setPersonalInvestmentBalance(e.target.value)}/>
                        </div>
                        <div className="verticalSpacer">
                            <label>Personal Investment Contribution:</label>
                            <input type="number"
                                   value={personalInvestmentContribution}
                                   onChange={(e) => setPersonalInvestmentContribution(e.target.value)}/>
                        </div>
                    </div>
                </div>


                <button type="submit">Calculate</button>
            </form>

            {result &&
                <div>
                    <div>
                        <button onClick={() => {setPercentile(0); setPercentileButton(0);}} className={percentileButton === 0 ? "activePercentileButton": ""}>Worst Case
                        </button>
                        <button onClick={() => {setPercentile(1); setPercentileButton(1);}} className={percentileButton === 1 ? "activePercentileButton": ""}>Set Percentile
                            to 1
                        </button>
                        <button onClick={() => {setPercentile(10); setPercentileButton(2);}} className={percentileButton === 2 ? "activePercentileButton": ""}>Set Percentile
                            to 10
                        </button>
                        <button onClick={() => {setPercentile(25); setPercentileButton(3);}} className={percentileButton === 3 ? "activePercentileButton": ""}>Set Percentile
                            to 25
                        </button>
                        <button onClick={() => {setPercentile(50); setPercentileButton(4);}} className={percentileButton === 4 ? "activePercentileButton": ""}>Set Percentile
                            to 50
                        </button>
                        <button onClick={() => {setPercentile(75); setPercentileButton(5);}} className={percentileButton === 5 ? "activePercentileButton": ""}>Set Percentile
                            to 75
                        </button>
                        <button onClick={() => {setPercentile(99); setPercentileButton(6);}} className={percentileButton === 6 ? "activePercentileButton": ""}>Set Percentile
                            to 99
                        </button>
                        <button onClick={() => {setPercentile(100); setPercentileButton(7);}} className={percentileButton === 7 ? "activePercentileButton": ""}>Best Case
                        </button>
                    </div>

                    <MainResults result={result} percentile={percentile}/>
                </div>
            }
        </div>
    );
};

export default RetirementCalculator;

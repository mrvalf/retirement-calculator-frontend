import {
    LineChart,
    Legend,
    Tooltip,
    Line,
    XAxis,
    YAxis,
} from "recharts";
import AiCaption from "./AiCaption.jsx";
import {useState} from "react";

const MainResults = (inputData) => {
    const [visibleLines, setVisibleLines] = useState({
        "Total Net Worth": false,
        "Roth Ira": false,
        "Traditional Ira": false,
        "Roth 401k": false,
        "Traditional 401k": false,
        "Personal Investment": false,
    });

    if (!inputData || inputData.result == null) {
        return <div>No data available</div>;
    }

    const results = inputData.result;
    const percentile = inputData.percentile;
    let index = results.trials.length/100 * percentile;
    if (index < 0) {
        index = 0;
    } else if (index >= results.trials.length - 1) {
        index = results.trials.length - 1;
    }

    const currentTrial = results.trials[index];

    const getChartData = (trial) => {
        return trial.yearsOfData.map((y) => {return{
            "Age":y.age,
            "Total Net Worth": parseFloat(y.accounts.totalNetWorth.toFixed(2)),
            "Roth Ira":  parseFloat(y.accounts.rothIra.balance.toFixed(2)),
            "Traditional Ira":  parseFloat(y.accounts.traditionalIra.balance.toFixed(2)),
            "Roth 401k":  parseFloat(y.accounts.roth401k.balance.toFixed(2)),
            "Traditional 401k":  parseFloat(y.accounts.traditional401k.balance.toFixed(2)),
            "Personal Investment":  parseFloat(y.accounts.personalInvestment.balance.toFixed(2)),
        }})
    };

    const handleLegendClick = (dataKey) => {
        setVisibleLines((prevState) => ({
            ...prevState,
            [dataKey]: !prevState[dataKey],
        }));
    };

    return (
        <div>
                <div className="container">
                    <div className="spacer30px"/>
                    <LineChart data={getChartData(currentTrial)} margin={{right: 100}} width={1200} height={500}>
                        <div className="spacer30px"/>
                        <XAxis dataKey="Age" interval={"preserveStartEnd"}/>
                        <YAxis width={100}/>
                        <Legend onClick={(e) => handleLegendClick(e.dataKey)}
                                formatter={(value) => (
                                    <span style={{ cursor: "pointer" }}>{value}</span>
                                )}/>
                        <Tooltip contentStyle={{backgroundColor: "#333", color: "#fff"}}/>
                        <Line dataKey="Total Net Worth" stroke="red" activeDot={{r: 8}} hide={visibleLines["Total Net Worth"]}/>
                        <Line dataKey="Roth Ira" stroke="lightgreen" activeDot={{r: 8}} hide={visibleLines["Roth Ira"]}/>
                        <Line dataKey="Traditional Ira" stroke="lightblue" activeDot={{r: 8}} hide={visibleLines["Traditional Ira"]}/>
                        <Line dataKey="Roth 401k" stroke="yellow" activeDot={{r: 8}} hide={visibleLines["Roth 401k"]}/>
                        <Line dataKey="Traditional 401k" stroke="white" activeDot={{r: 8}} hide={visibleLines["Traditional 401k"]}/>
                        <Line dataKey="Personal Investment" stroke="gold" activeDot={{r: 8}} hide={visibleLines["Personal Investment"]}/>
                    </LineChart>
                </div>
            <AiCaption data={getChartData(currentTrial)} initalParameters={results.initialRetirementParameters}/>
        </div>
    );
};

export default MainResults;

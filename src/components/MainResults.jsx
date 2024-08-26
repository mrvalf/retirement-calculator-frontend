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
    const [graphData, setGraphData] = useState(null);

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

    const needsToUpdate = graphData == null ||
        currentTrial.yearsOfData.length !== graphData.length ||
        parseFloat(currentTrial.yearsOfData[currentTrial.yearsOfData.length - 1].accounts.totalNetWorth.toFixed(2)) !== graphData[graphData.length - 1]["Total Net Worth"] ||
        parseFloat(currentTrial.yearsOfData[currentTrial.yearsOfData.length - 2].accounts.totalNetWorth.toFixed(2)) !== graphData[graphData.length - 2]["Total Net Worth"];


    const accountToggle = (mappedTrial, account) => {
        return mappedTrial.some(trial => trial[account] > 0.01);
    };

    if (needsToUpdate) {
        const mappedTrial = currentTrial.yearsOfData.map((y) => {return{
            "Age":y.age,
            "Total Net Worth": parseFloat(y.accounts.totalNetWorth.toFixed(2)),
            "Roth Ira":  parseFloat(y.accounts.rothIra.balance.toFixed(2)),
            "Traditional Ira":  parseFloat(y.accounts.traditionalIra.balance.toFixed(2)),
            "Roth 401k":  parseFloat(y.accounts.roth401k.balance.toFixed(2)),
            "Traditional 401k":  parseFloat(y.accounts.traditional401k.balance.toFixed(2)),
            "Personal Investment":  parseFloat(y.accounts.personalInvestment.balance.toFixed(2)),
        }});
        setGraphData(mappedTrial);
        setVisibleLines({
            "Roth Ira": accountToggle(mappedTrial, "Roth Ira"),
            "Traditional Ira": accountToggle(mappedTrial, "Traditional Ira"),
            "Roth 401k": accountToggle(mappedTrial, "Roth 401k"),
            "Traditional 401k": accountToggle(mappedTrial, "Traditional 401k"),
            "Personal Investment": accountToggle(mappedTrial, "Personal Investment"),
        });

    }

    const handleLegendClick = (dataKey) => {
        setVisibleLines((prevState) => ({
            ...prevState,
            [dataKey]: !prevState[dataKey],
        }));
    };

    const addCommas = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const addCommasAndCents = (num) => {
        return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div>
            <div className="container">
                <div className="spacer30px"/>
                <LineChart data={graphData} margin={{right: 150}} width={1200} height={500}>
                    <XAxis dataKey="Age" interval="preserveStartEnd"/>
                    <YAxis tickFormatter={addCommas} width={100}/>
                    <Legend onClick={(e) => handleLegendClick(e.dataKey)}
                            formatter={(value) => (
                                <span style={{ cursor: "pointer" }}>{value}</span>
                            )}/>
                    <Tooltip
                        formatter={(value) => addCommasAndCents(value)}
                        contentStyle={{backgroundColor: "#333", color: "#fff"}}/>
                    <Line dataKey="Total Net Worth" stroke="#FF6347" activeDot={{r: 8}} hide={visibleLines["Total Net Worth"]}/>
                    <Line dataKey="Roth Ira" stroke="#4682B4" activeDot={{r: 8}} hide={visibleLines["Roth Ira"]}/>
                    <Line dataKey="Traditional Ira" stroke="#32CD32" activeDot={{r: 8}} hide={visibleLines["Traditional Ira"]}/>
                    <Line dataKey="Roth 401k" stroke="#FFD700" activeDot={{r: 8}} hide={visibleLines["Roth 401k"]}/>
                    <Line dataKey="Traditional 401k" stroke="#EE82EE" activeDot={{r: 8}} hide={visibleLines["Traditional 401k"]}/>
                    <Line dataKey="Personal Investment" stroke="#FF4500" activeDot={{r: 8}} hide={visibleLines["Personal Investment"]}/>
                </LineChart>
            </div>

            <AiCaption data={graphData} initalParameters={results.initialRetirementParameters}/>
        </div>
    );
};

export default MainResults;

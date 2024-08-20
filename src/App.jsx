import {
    Route,
    Routes,
    BrowserRouter
} from 'react-router-dom';
import Login from './components/Login';
import RetirementCalculator from './components/RetirementCalculator';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}></Route>
                <Route path="/calculator" element={<RetirementCalculator/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

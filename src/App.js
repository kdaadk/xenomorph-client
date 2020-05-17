import React from 'react';
import {Route} from 'react-router';
import './App.css';
import Home from "./pages/Home";
import {Test} from "./pages/Test";

function App() {
    return (
        <div className="App">
            <Route exact path={'/'} component={Home}/>
            <Route exact path={'/test'} component={Test}/>
        </div>
    );
}

export default App;
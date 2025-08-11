import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Teams from '../pages/Teams';
import Schedule from '../pages/Schedule';
import Standings from '../pages/Standings';
import Roster from '../pages/Roster';


export default function AppRouter(){
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/standings' element={<Standings />} />
            <Route path='/teams' element={<Teams />} />
            <Route path='/roster/:teamAbbrev' element={<Roster />} />

        </Routes>
    )
}

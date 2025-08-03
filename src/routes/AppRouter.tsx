import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Teams from '../pages/Teams';


export default function AppRouter(){
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/teams' element={<Teams />} />
        </Routes>
    )
}

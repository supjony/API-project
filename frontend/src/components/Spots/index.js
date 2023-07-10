
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleSpot from '../SingleSpot';
import { getSpotsThunk } from '../../store/spotReducer';

function AllSpots ({}) {
    const dispatch = useDispatch();
    const spot = useSelector(state=>state.spots);

    useEffect(() => {
      dispatch(getSpotsThunk());
    }, [dispatch]);


    return (
        <>

    <ul>
        {spots.map((spot) => (
            <SingleSpot spot={spot} key={spot.id}/>
        ))}
    </ul>
    </>
    )
}

export default AllSpots



 {/* {Spots.map((spot) => (
        <li key ={spot.id}>
        <NavLink to={`/spots/${spot.id}`}>{spot.name}</NavLink>
        </li>
      ))} */}

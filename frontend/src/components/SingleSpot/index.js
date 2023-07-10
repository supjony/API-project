// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getSingleSpotThunk } from '../../store/spotReducer';
// import { useDispatch } from 'react-redux';
// import { useEffect } from 'react';


// const SingleSpot = ({spots}) => {
//     console.log('hello')


//   const dispatch = useDispatch();
//   const spot = useSelector(state=>state.spots);

//   useEffect(() => {
//     dispatch(getSingleSpotThunk());
//   }, [dispatch]);

//   const { id } = useParams()
//   const singleSpot = spots.find((spot) => spot.id === id)


//   if(!spot.length > 0) return null

//   return (
//     <div className='singleArticle'>
//       <h1>{singleSpot.name}</h1>

//     </div>
//   );
// };

// export default SingleSpot;


import Bidding_Mainbar from '../components/bidding components/Bidding_Mainbar';
import Sidebar from '../components/Sidebar'

const Bidding = () => {
  return (
    <div className='flex'>

     <div>
          <Sidebar/>
     </div>

     <Bidding_Mainbar/>

    </div>
  )
}

export default Bidding;
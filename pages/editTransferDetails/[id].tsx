import React, { useEffect, useState } from "react"
import { useRouter } from "next/router";
import TransferForm from "@/components/TransferForm";
import { getTransferDetails } from "@/services/api";


const EditTransferPage = () => {

  const router = useRouter();
  const {id} = router.query;
  const [transfer, setTransfer] = useState<any>(null);

  useEffect(() => {
    const fethcTransferDetails = async () => {
      if(id){
        try {
          const transferDetails = await getTransferDetails(Number(id));
          setTransfer(transferDetails);
        } catch (error) {
          console.error("Error while fetching transfer details: ", error)
        }
      }
    }

    fethcTransferDetails()
  }, [id]);

  if(!transfer){
    return <div>Loading....</div>
  }


  return(
    <h1>Update Transfer</h1>
    // <TransferForm  />
  )
}

export default EditTransferPage;
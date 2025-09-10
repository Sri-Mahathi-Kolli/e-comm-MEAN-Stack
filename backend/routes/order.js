const express= require("express");
const router =express.Router();
const { getOrders,updateOrderStatus, adminCancelOrder} = require("./../handlers/order-handler");


router.get("",async (req,res)=>{
    const orders=await getOrders();
    res.send(orders);
});

router.post("/:id",async (req,res)=>{
    const id=req.params.id;
    const status=req.body.status;
    await updateOrderStatus(id,status);
    res.send({message:"updated"});
});

router.post("/:id/cancel",async (req,res)=>{
    try {
        const orderId = req.params.id;
        const reason = req.body.reason || 'Product not available';
        const result = await adminCancelOrder(orderId, reason);
        res.send(result);
    } catch (error) {
        console.error('Error cancelling order (admin):', error);
        res.status(400).send({ 
            error: error.message || 'Failed to cancel order' 
        });
    }
});

module.exports=router;
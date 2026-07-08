import { useParams } from "react-router-dom";
import { useOrderById } from "../../context/api/order";
import {OrderViewContent,OrderLoadError,OrderNotFound,OrderViewSkeleton} from "./ComponetViewOrder";
import type { IOrder } from "../../Types/order";

export default function OrderView() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data:order, isLoading,isError } = useOrderById(orderId || "");


  if (isLoading) return <OrderViewSkeleton />;
  if (isError && !order) return <OrderNotFound orderId={orderId} />;
  if (isError)
    return <OrderLoadError />;

  return <OrderViewContent onRefresh={() =>{window.location.reload()}} order={order as IOrder} />;
}



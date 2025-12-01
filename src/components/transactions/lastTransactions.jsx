import { TableGet } from "../table";

export const LastTransactions = ({urlBase}) => {
    

    return (
        <>
            <h1>Ultimos Traslados</h1>
            <TableGet url={`${urlBase}/api/v1/transactions`}/>
        </>
    );
}
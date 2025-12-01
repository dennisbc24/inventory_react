import { TableGet } from "../table";

export const LastEntries = ({urlBase}) => {
    

    return (
        <>
            <h1>Ultimos Ingresos</h1>
            <TableGet url={`${urlBase}/api/v1/entries`}/>
        </>
    );
}
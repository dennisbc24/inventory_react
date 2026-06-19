import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function SalesChart({ urlBase }) {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const url = `${urlBase}/api/v1/summaries/summaryByDay?year=${year}&month=${month}`;
                
                const response = await axios.get(url);
                
                // Seteamos la data completa tal cual viene de la API
                setSalesData(response.data); 
            } catch (error) {
                console.error("Error al cargar los datos de ventas:", error);
            }
        };
        fetchSales();
    }, [urlBase]);

    return (
        <div style={{ width: '100%', height: 350, backgroundColor: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'sans-serif', color: '#444', marginBottom: '20px' }}>
                Ventas del Mes Actual
            </h3>
            
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2962FF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2962FF" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    
                    <XAxis 
                        dataKey="dia" 
                        tick={{ fontSize: 11 }}
                        // interval="preserveStartEnd" evita que los números se traslapen si hay muchos días
                        interval="preserveStartEnd" 
                        minTickGap={10}
                    />
                    
                    <YAxis tick={{ fontSize: 11 }} />
                    
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        labelFormatter={(value) => `Día: ${value}`}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey="ganancia" 
                        stroke="#2962FF" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorVentas)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
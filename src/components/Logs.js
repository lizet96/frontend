// Fix the import statement - remove unused components
import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import NavBar from './NavBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// Remove unused imports
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Logs() {
  const [logs, setLogs] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const [requestCounts, setRequestCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Kept for potential future use

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get URLs for both servers
        const server1Url = process.env.REACT_APP_SERVER1_URL || 'http://localhost:3001';
        const server2Url = process.env.REACT_APP_SERVER2_URL || 'http://localhost:3002';
        
        console.log('Using server URLs:', { server1: server1Url, server2: server2Url });
        
        // Use server2 for logs and request counts
        const [logsResponse, requestCountResponse] = await Promise.all([
          axios.get(`${server2Url}/api/logs`),
          axios.get(`${server2Url}/api/logs/request-count`)
        ]);
        
        // Get response times from both servers
        const [responseTimeServer1, responseTimeServer2] = await Promise.all([
          axios.get(`${server1Url}/api/logs/response-time`).catch(err => {
            console.warn('Failed to fetch server1 response times:', err);
            return { data: [] }; // Return empty array on error
          }),
          axios.get(`${server2Url}/api/logs/response-time`)
        ]);
        
        // Combine response times from both servers
        const combinedResponseTimes = [
          ...responseTimeServer1.data,
          ...responseTimeServer2.data
        ];
        
        console.log('Response time data count:', combinedResponseTimes.length);
        console.log('Server1 response times:', responseTimeServer1.data.length);
        console.log('Server2 response times:', responseTimeServer2.data.length);
        
        setLogs(logsResponse.data);
        setResponseTimes(combinedResponseTimes);
        setRequestCounts(requestCountResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data: ' + (error.message || 'Unknown error'));
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Original logs data processing
  const processLogsData = () => {
    const logLevels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    
    const server1Logs = logs.filter(log => log.server === 'server1');
    const server2Logs = logs.filter(log => log.server === 'server2');

    const server1Data = logLevels.map(level => 
      server1Logs.filter(log => log.level === level).length
    );
    
    const server2Data = logLevels.map(level => 
      server2Logs.filter(log => log.level === level).length
    );

    return {
      labels: logLevels,
      datasets: [
        {
          label: 'Server 1 (with Rate Limit)',
          data: server1Data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Server 2 (without Rate Limit)',
          data: server2Data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Process response time data with better error handling and debugging
  const processResponseTimeData = () => {
    console.log('Processing response times, count:', responseTimes.length);
    
    if (!responseTimes || responseTimes.length === 0) {
      console.log('No response time data available');
      // Return dummy data if no response times available
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: 'Server 1 Response Time (ms)',
            data: [0],
            borderColor: 'rgba(53, 162, 235, 1)',
            backgroundColor: 'rgba(53, 162, 235, 0.2)',
          },
          {
            label: 'Server 2 Response Time (ms)',
            data: [0],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }
        ]
      };
    }
    
    // Debug server values
    console.log('Server values in data:', responseTimes.map(item => item.server));
    
    // Filter data by server
    const server1Data = responseTimes
      .filter(item => item.server === 'server1')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    const server2Data = responseTimes
      .filter(item => item.server === 'server2')
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    console.log('Server1 data count:', server1Data.length);
    console.log('Server2 data count:', server2Data.length);
    
    // Create separate timestamps for each server
    const server1Timestamps = server1Data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString();
    });
    
    const server2Timestamps = server2Data.map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString();
    });
    
    // Use the longest timestamp array or create a combined one
    const allTimestamps = [...new Set([...server1Timestamps, ...server2Timestamps])].sort();
    
    // Create datasets with null values for missing points
    const server1Values = [];
    const server2Values = [];
    
    allTimestamps.forEach(timestamp => {
      const s1Item = server1Data.find(item => {
        const itemTime = new Date(item.timestamp).toLocaleTimeString();
        return itemTime === timestamp;
      });
      
      const s2Item = server2Data.find(item => {
        const itemTime = new Date(item.timestamp).toLocaleTimeString();
        return itemTime === timestamp;
      });
      
      server1Values.push(s1Item ? s1Item.responseTime : null);
      server2Values.push(s2Item ? s2Item.responseTime : null);
    });
    
    return {
      labels: allTimestamps.length > 0 ? allTimestamps : ['No Data'],
      datasets: [
        {
          label: 'Server 1 Response Time (ms)',
          data: server1Values.length > 0 ? server1Values : [0],
          borderColor: 'rgba(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          fill: false,
          tension: 0.1,
          spanGaps: true
        },
        {
          label: 'Server 2 Response Time (ms)',
          data: server2Values.length > 0 ? server2Values : [0],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1,
          spanGaps: true
        }
      ]
    };
  };

  // Process request count data
  const processRequestCountData = () => {
    // Limit to top 5 endpoints for better visualization
    const topEndpoints = requestCounts
      .sort((a, b) => (b.server1Count + b.server2Count) - (a.server1Count + a.server2Count))
      .slice(0, 5);

    return {
      labels: topEndpoints.map(item => {
        // Shorten endpoint names for better display
        const endpoint = item.endpoint;
        return endpoint.length > 15 ? endpoint.substring(endpoint.lastIndexOf('/') + 1) || endpoint : endpoint;
      }),
      datasets: [
        {
          label: 'Server 1 Requests',
          data: topEndpoints.map(item => item.server1Count),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Server 2 Requests',
          data: topEndpoints.map(item => item.server2Count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const logOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Log Distribution by Server and Type',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const responseTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Server Response Times (ms)',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Response Time (ms)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  const requestCountOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Request Count by Endpoint',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Requests'
        }
      }
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Container>
          <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 8, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            System Logs Analysis
          </Typography>
          
          {logs.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              <Bar options={logOptions} data={processLogsData()} />
            </Box>
          ) : (
            <Typography>No logs available</Typography>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Server Response Times
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Line options={responseTimeOptions} data={processResponseTimeData()} />
            {responseTimes.length === 0 && (
              <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                No response time data available. This could be because:
                <ul>
                  <li>The server hasn't processed any requests with response time tracking</li>
                  <li>The response-time endpoint isn't returning data in the expected format</li>
                  <li>There's a connection issue with the server</li>
                </ul>
              </Typography>
            )}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Request Count by Endpoint
          </Typography>
          
          {requestCounts.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              <Bar options={requestCountOptions} data={processRequestCountData()} />
            </Box>
          ) : (
            <Typography>No request count data available</Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Logs;
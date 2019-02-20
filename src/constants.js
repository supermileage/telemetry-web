import moment from 'moment';

export const data = {
    datasets: [
        {
            spanGaps: false,
            showLine: true,
            label: 'Velocity',
            yAxisID: 'Velocity',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [] // Data to update
        },
        {
            spanGaps: false,
            showLine: true,
            label: 'Power',
            yAxisID: 'Power',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [] // Data to update
        }
    ],
};
  
export const request = (state, type) => {
return (state.current) ? {
    query: {
        filter: {
            compositeFilter: {
                filters: [
                {
                    propertyFilter: {
                        op: 'GREATER_THAN_OR_EQUAL',
                        property: {
                            name: 'published_at'
                        },
                        value: {
                            stringValue: state.startTime.toISOString()
                        }
                    }
                },
                {
                    propertyFilter: {
                        op: 'EQUAL',
                        property: {
                            name: 'event'
                        },
                        value: {
                            stringValue: type
                        }
                    }
                }
                ],
                op: "AND"
            }
        },
        kind: [
            {
                name: 'ParticleEvent'
            }
        ],
        projection: [
            {
                property: {
                    name: 'data'
                }
            },
            {
                property: {
                    name: 'published_at'
                }
            }
        ],
    }
    } : {
    query: {
        filter: {
            compositeFilter: {
                filters: [
                {
                    propertyFilter: {
                        op: 'GREATER_THAN_OR_EQUAL',
                        property: {
                            name: 'published_at'
                        },
                        value: {
                            stringValue: state.startTime.toISOString()
                        }
                    }
                },
                {
                    propertyFilter: {
                        op: 'LESS_THAN_OR_EQUAL',
                        property: {
                            name: 'published_at'
                        },
                        value: {
                            stringValue: state.endTime.toISOString()
                        }
                    }
                },
                {
                    propertyFilter: {
                        op: 'EQUAL',
                        property: {
                            name: 'event'
                        },
                        value: {
                            stringValue: type
                        }
                    }
                }
                ],
                op: "AND"
            }
        }
        ,
        kind: [
        {
            name: "ParticleEvent"
        }
        ],
        projection: [
        {
            property: {
            name: "data"
            }
        },
        {
            property: {
            name: "published_at"
            }
        }
        ]
    }
}
};

export const shortcuts = {
'Today': moment(),
'Yesterday': moment().subtract(1, 'days'),
};
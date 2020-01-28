export const chartBuilder = (label, id, data) => {
  return {
    datasets: [
      {
        spanGaps: false,
        showLine: true,
        label: label,
        yAxisID: id,
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data
      }
    ]
  };
};

export const queryBuilder = (liveMode, startTime, endTime, id) => {
  return liveMode
    ? {
        query: {
          filter: {
            compositeFilter: {
              filters: [
                {
                  propertyFilter: {
                    op: "GREATER_THAN_OR_EQUAL",
                    property: {
                      name: "recorded_at"
                    },
                    value: {
                      stringValue: startTime.toISOString()
                    }
                  }
                },
                {
                  propertyFilter: {
                    op: "EQUAL",
                    property: {
                      name: "event"
                    },
                    value: {
                      stringValue: id
                    }
                  }
                }
              ],
              op: "AND"
            }
          },
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
                name: "recorded_at"
              }
            }
          ]
        }
      }
    : {
        query: {
          filter: {
            compositeFilter: {
              filters: [
                {
                  propertyFilter: {
                    op: "GREATER_THAN_OR_EQUAL",
                    property: {
                      name: "recorded_at"
                    },
                    value: {
                      stringValue: startTime.toISOString()
                    }
                  }
                },
                {
                  propertyFilter: {
                    op: "LESS_THAN_OR_EQUAL",
                    property: {
                      name: "recorded_at"
                    },
                    value: {
                      stringValue: endTime.toISOString()
                    }
                  }
                },
                {
                  propertyFilter: {
                    op: "EQUAL",
                    property: {
                      name: "event"
                    },
                    value: {
                      stringValue: id
                    }
                  }
                }
              ],
              op: "AND"
            }
          },
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
                name: "recorded_at"
              }
            }
          ]
        }
      };
};

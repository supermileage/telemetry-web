export const chartBuilder = (color, label, id, data) => {
  return {
    datasets: [
      {
        spanGaps: false,
        showLine: true,
        label: label,
        yAxisID: id,
        fill: true,
        lineTension: 0.1,
        backgroundColor: color,
        borderColor: color,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: color,
        pointBackgroundColor: color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: color,
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

let taskChart = null;

// Create or Update Pie Chart
function updateChart(completed, pending) {

    const canvas = document.getElementById("taskChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Destroy old chart
    if (taskChart) {
        taskChart.destroy();
    }

    // Check current theme
    const isDark = document.body.classList.contains("dark");

    taskChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: ["Completed", "Pending"],

            datasets: [{

                data: [completed, pending],

                backgroundColor: [
                    "#22c55e",   // Green
                    "#ef4444"    // Red
                ],

                borderColor: isDark ? "#1e293b" : "#ffffff",

                borderWidth: 4,

                hoverOffset: 18

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,
            aspectRatio: 1,

            cutout: "60%",

            animation: {
                animateRotate: true,
                animateScale: true
            },

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: isDark ? "#ffffff" : "#222222",

                        font: {
                            size: 14,
                            weight: "bold"
                        },

                        padding: 20

                    }

                },

                title: {

                    display: true,

                    text: "Student Task Progress",

                    color: isDark ? "#ffffff" : "#222222",

                    font: {
                        size: 20,
                        weight: "bold"
                    }

                },

                tooltip: {

                    backgroundColor: isDark ? "#334155" : "#ffffff",

                    titleColor: isDark ? "#ffffff" : "#222222",

                    bodyColor: isDark ? "#ffffff" : "#222222",

                    borderColor: "#3b82f6",

                    borderWidth: 1

                }

            }

        }

    });

}
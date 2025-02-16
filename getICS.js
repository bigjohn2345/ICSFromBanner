//--bigJohn2345 2025; script most created with generative AI

function calculateSemesterEnd(termCode) {
    if (!termCode || termCode.length !== 6) {
        console.warn("Invalid term code:", termCode);
        return "20251231T235959Z"; // Fallback
    }

    let year = termCode.substring(0, 4); // Extract the year (YYYY)
    let semester = termCode.substring(4, 6); // Extract semester identifier (30, 10, 50)

    let month, day;

    if (semester === "30") { // Spring → 2nd Friday of May
        month = 5;
        day = 14; // Approximation, can refine later
    } else if (semester === "10") { // Fall → 2nd Friday of December
        month = 12;
        day = 13;
    } else if (semester === "50") { // Summer → 1st Friday of August
        month = 8;
        day = 8;
    } else {
        console.warn("Unknown semester code:", semester);
        return "20251231T235959Z"; // Default fallback
    }

    return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T235959Z`;
}

function generateICSWithAlgorithmicRecurrence() {
    const events = JSON.parse(sessionStorage.getItem("classScheduleEvents"));
    if (!events || events.length === 0) {
        console.error("No events found in sessionStorage.");
        return;
    }

    // Find the most common term
    let termCounts = {};
    events.forEach(event => {
        termCounts[event.term] = (termCounts[event.term] || 0) + 1;
    });

    let mostCommonTerm = Object.keys(termCounts).reduce((a, b) =>
        termCounts[a] > termCounts[b] ? a : b
    );

    let semesterEnd = calculateSemesterEnd(mostCommonTerm);

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your App//EN\nCALSCALE:GREGORIAN\n`;

    events.forEach(event => {
        let start = event.start.replace(/[-:]/g, '').split('.')[0] + 'Z';
        let end = event.end.replace(/[-:]/g, '').split('.')[0] + 'Z';

        icsContent += `BEGIN:VEVENT\n`;
        icsContent += `UID:${event.id}@yourdomain.com\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
        icsContent += `DTSTART:${start}\n`;
        icsContent += `DTEND:${end}\n`;
        icsContent += `SUMMARY:${event.title}\n`;
        icsContent += `DESCRIPTION:Course ${event.subject} ${event.courseNumber}, CRN ${event.crn}\n`;
        icsContent += `RRULE:FREQ=WEEKLY;UNTIL=${semesterEnd}\n`;
        icsContent += `END:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    // Create the file and trigger download
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schedule_${mostCommonTerm}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

generateICSWithAlgorithmicRecurrence();

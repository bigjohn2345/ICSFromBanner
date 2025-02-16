//--bigJohn2345 2025; script most created with generative AI

function generateICS() {
    const events = JSON.parse(sessionStorage.getItem("classScheduleEvents"));
    if (!events || events.length === 0) {
        console.error("No events found in sessionStorage.");
        return;
    }

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
        icsContent += `END:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    // Create the file and trigger download
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

generateICS();

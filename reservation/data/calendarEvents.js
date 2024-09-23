export function transformReservations(reservations) {
    const newList = reservations.map(oldObject => {
        return {
            start: oldObject.date + "T" + oldObject.start + ":00.000Z",
            end: oldObject.date + "T" + oldObject.finish + ":00.000Z",
            startStr: oldObject.date + "T" + oldObject.start + ":00+02:00",
            endStr: oldObject.date + "T" + oldObject.finish + ":00+02:00",
            title: oldObject.name,
            person: oldObject.person,
            allDay: false,
            jsEvent: {
                isTrusted: true
            },
            view: {
                type: "timeGridWeek",
                dateEnv: {
                    timeZone: "local",
                    canComputeOffset: true,
                    calendarSystem: {},
                    locale: {
                        codeArg: "pl",
                        codes: ["pl"],
                        week: {
                            dow: 0,
                            doy: 4
                        },
                        simpleNumberFormat: {},
                        options: {
                            direction: "ltr",
                            buttonText: {
                                prev: "prev",
                                next: "next",
                                prevYear: "prev year",
                                nextYear: "next year",
                                year: "year",
                                today: "today",
                                month: "month",
                                week: "week",
                                day: "day",
                                list: "list"
                            },
                            weekText: "W",
                            weekTextLong: "Week",
                            closeHint: "Close",
                            timeHint: "Time",
                            eventHint: "Event",
                            allDayText: "all-day",
                            moreLinkText: "more",
                            noEventsText: "No events to display",
                            buttonHints: {
                                prev: "Previous $0",
                                next: "Next $0"
                            },
                            viewHint: "$0 view",
                            navLinkHint: "Go to $0"
                        }
                    },
                    weekDow: 0,
                    weekDoy: 4,
                    weekText: "W",
                    weekTextLong: "Week",
                    cmdFormatter: null,
                    defaultSeparator: " - "
                }
            }
        };
    });

    return newList;
}

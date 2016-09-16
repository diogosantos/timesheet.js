(function() {
    'use strict';

    Date.prototype.diff = function(date2) {
        var timeDiff = Math.abs(this.getTime() - date2.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    Date.prototype.toString = function() {
        var monthNames = [
            "JAN", "FEB", "MAR",
            "APR", "MAY", "JUN", "JUL",
            "AUG", "SEP", "OCT",
            "NOV", "DEC"
        ];
        return this.getDate() + "/" + monthNames[this.getMonth()];
    };

    Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf());
        if(days > 0) {
            dat.setDate(dat.getDate() + days);
        }
        return dat;
    };

    /**
     * Initialize a Timesheet
     */
    var Timesheet = function(container, min, max, data) {
        this.data = [];
        this.dateRange = {
            min: min,
            max: max
        };

        this.parse(data || []);

        if (typeof document !== 'undefined') {
            this.container = (typeof container === 'string') ? document.querySelector('#' + container) : container;
            this.drawSections();
            this.insertData();
        }
    };

    Timesheet.prototype.daysRange = function() {
        return this.dateRange.min.diff(this.dateRange.max);
    };

    /**
     * Insert data into Timesheet
     */
    Timesheet.prototype.insertData = function() {
        var html = [];
        var sectionCSSWidth = 47;

        for (var n = 0, m = this.data.length; n < m; n++) {
            var cur = this.data[n];
            var bubble = this.createBubble(sectionCSSWidth, this.dateRange.min, cur.start, cur.end);

            var line = [
                '<span style="margin-left: ' + bubble.getStartOffset() + 'px; width: ' + bubble.getWidth() + 'px;" class="bubble bubble-' + (cur.category || 'default') + '" data-duration="' + (cur.end ? Math.round((cur.end - cur.start) / 1000 / 60 / 60 / 24 / 39) : '') + '"></span>',
                '<span class="date">' + bubble.getDateLabel() + '</span> ',
                '<span class="label">' + cur.label + '</span>'
            ].join('');

            html.push('<li>' + line + '</li>');
        }

        this.container.innerHTML += '<ul class="data">' + html.join('') + '</ul>';
    };

    /**
     * Draw section labels
     */
    Timesheet.prototype.drawSections = function() {
        var html = [];
        var differenceInDays = this.daysRange(); // get the range from the data??!?
        for (var i = 0; i <= differenceInDays; i++) {
            var day = this.dateRange.min.addDays(i);
            html.push('<section>' + day + '</section>');
        }
        this.container.className = 'timesheet color-scheme-default';
        this.container.innerHTML = '<div class="scale">' + html.join('') + '</div>';
    };

    /**
     * Parse passed data
     */
    Timesheet.prototype.parse = function(data) {
        for (var n = 0, m = data.length; n < m; n++) {

            var current = data[n];

            if (current.start < this.dateRange.min) {
                this.dateRange.min = current.start;
            }

            if (current.end && current.end > this.dateRange.max) {
                this.dateRange.max = current.end;
            } else if (current.start > this.dateRange.max) {
                this.dateRange.max = current.start;
            }

            this.data.push(current);
        }
    };

    /**
     * Wrapper for adding bubbles
     */
    Timesheet.prototype.createBubble = function(sectionWidth, min, start, end) {
        return new Bubble(sectionWidth, min, start, end);
    };

    /**
     * Timesheet Bubble
     */
    var Bubble = function(sectionsWidth, min, start, end) {
        this.min = min;
        this.start = start;
        this.end = end;
        this.sectionsWidth = sectionsWidth;
    };

    /**
     * Calculate starting offset for bubble
     */
    Bubble.prototype.getStartOffset = function() {
        //TODO: refactor for dynamic calculation
        return this.sectionsWidth * this.start.diff(this.min);
       // return (this.range / 30) * (30 * this.start.diff(this.min) + this.start.getDate());
    };

    /**
     * Get count of all months in Timesheet Bubble
     */
    Bubble.prototype.getDays = function() {
        return this.start.diff(this.end);
    };

    /**
     * Get bubble's width in pixel
     */
    Bubble.prototype.getWidth = function() {
        return this.sectionsWidth * this.getDays();
    };

    /**
     * Get the bubble's label
     */
    Bubble.prototype.getDateLabel = function() {
        return [this.start, this.end].join("->");
    };

    window.Timesheet = Timesheet;
})();
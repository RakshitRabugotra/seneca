# The styles for the HTML document generated from markdown
# Define a basic CSS for styling the PDF
A4_PRINT_CSS = """
@page {
    size: A4;
    margin: 20mm; /* Standard margin for printed documents */
}

body {
    font-family: 'Arial', sans-serif;
    font-size: 12pt; /* Use 'pt' for print-friendly sizes */
    line-height: 1.6;
    color: #333333;
    margin: 0;
    padding: 0;
}

/* Heading Styles */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Georgia', serif;
    color: #444444;
    margin: 20px 0 10px 0;
}

h1 {
    font-size: 24pt;
    font-weight: bold;
}

h2 {
    font-size: 20pt;
    font-weight: bold;
}

h3 {
    font-size: 18pt;
    font-weight: bold;
}

h4, h5, h6 {
    font-size: 16pt;
    font-weight: normal;
}

/* Paragraph Styles */
p {
    margin: 10pt 0;
    text-align: justify;
}

/* Link Styles */
a {
    color: #0066CC;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Image Styles */
img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10pt auto;
    page-break-inside: avoid; /* Prevent images from being split between pages */
}

/* Div Styles */
div {
    margin: 10pt 0;
    padding: 10pt;
    border: 1pt solid #dddddd;
}

/* Table Styles */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20pt 0;
}

th, td {
    border: 1pt solid #dddddd;
    padding: 8pt;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

/* List Styles */
ul, ol {
    margin: 10pt 0 10pt 20pt;
    padding: 0;
}

li {
    margin: 5pt 0;
}

/* Footer Styles */
footer {
    text-align: center;
    margin-top: 20pt;
    font-size: 10pt;
    color: #888888;
}

/* Page Breaks */
.page-break {
    page-break-before: always;
}

/* Prevent content from being split across pages */
h1, h2, h3, h4, h5, h6, p, img, div, table {
    page-break-inside: avoid;
}

/* Print-specific Styles */
@media print {
    body {
        width: 100%;
    }

    /* Optional: Remove hyperlink underlines in print */
    a {
        text-decoration: none;
        color: black; /* For readability in print */
    }

    /* Remove margins on the first page */
    @page:first {
        margin-top: 0;
    }
}
"""

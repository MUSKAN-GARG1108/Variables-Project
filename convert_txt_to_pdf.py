from fpdf import FPDF
import unicodedata

# Define file paths
txt_file_path = "PrinciplesOfBiology.txt"  # Ensure this file exists in the same folder
pdf_file_path = "PrinciplesOfBiology.pdf"

# Function to remove or replace Unicode characters
def clean_text(text):
    return ''.join(c for c in text if unicodedata.category(c)[0] != 'C')  # Remove control characters

# Create a PDF instance
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()
pdf.set_font("Arial", size=12)

# Read text from the file and add it to the PDF
with open(txt_file_path, "r", encoding="utf-8") as file:
    for line in file:
        cleaned_line = clean_text(line)  # Remove special Unicode characters
        pdf.multi_cell(0, 10, cleaned_line.encode('latin-1', 'ignore').decode('latin-1'))  # Ensure Latin-1 compatibility

# Save the PDF
pdf.output(pdf_file_path, "F")

print(f"✅ Successfully converted {txt_file_path} to {pdf_file_path}")

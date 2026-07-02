from datetime import datetime, timezone
from pathlib import Path
import shutil

from fastapi import APIRouter, File, UploadFile, HTTPException

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def analyze_document(filename: str, content_type: str | None = None) -> dict[str, object]:
    lowered_name = (filename or "").lower()
    lowered_type = (content_type or "").lower()

    if any(token in lowered_name for token in ["policy", "certificate", "coverage", "insurance"]):
        document_type = "Insurance Policy"
        claim_related = True
        confidence = 0.94
        summary = [
            "Policy coverage details detected.",
            "Useful for validating the insured plan.",
            "Supports claim verification and review.",
        ]
    elif any(token in lowered_name for token in ["hospital", "bill", "invoice", "receipt", "discharge", "admission", "pharmacy"]):
        document_type = "Hospital Bill"
        claim_related = True
        confidence = 0.93
        summary = [
            "Medical expense document detected.",
            "Includes billing or treatment evidence.",
            "Strong support for reimbursement claims.",
        ]
    elif any(token in lowered_name for token in ["prescription", "rx", "doctor", "medicine"]):
        document_type = "Prescription"
        claim_related = True
        confidence = 0.91
        summary = [
            "Prescription document detected.",
            "Medical treatment details are present.",
            "Useful for medical claim support.",
        ]
    elif any(token in lowered_name for token in ["report", "lab", "scan", "diagnosis", "radiology", "test"]):
        document_type = "Medical Report"
        claim_related = True
        confidence = 0.9
        summary = [
            "Medical report identified.",
            "Contains diagnostic or treatment evidence.",
            "Helpful for claim processing.",
        ]
    elif any(token in lowered_name for token in ["damage", "vehicle", "car", "accident", "repair", "dent"]):
        document_type = "Vehicle Damage Image"
        claim_related = True
        confidence = 0.89
        summary = [
            "Vehicle damage evidence detected.",
            "Useful for motor claim assessment.",
            "Supports repair and loss documentation.",
        ]
    elif any(token in lowered_name for token in ["aadhaar", "aadhar"]):
        document_type = "Aadhaar Card"
        claim_related = False
        confidence = 0.95
        summary = [
            "Identity document detected.",
            "Useful for customer verification.",
            "May be required for onboarding or KYC."
        ]
    elif any(token in lowered_name for token in ["license", "driving", "dl"]):
        document_type = "Driving License"
        claim_related = False
        confidence = 0.94
        summary = [
            "Driving credential detected.",
            "Supports identity and vehicle verification.",
            "Useful for policy or claim validation.",
        ]
    elif any(token in lowered_name for token in ["pan", "permanent account"]):
        document_type = "PAN Card"
        claim_related = False
        confidence = 0.95
        summary = [
            "Financial identity document detected.",
            "Useful for profile verification.",
            "May support KYC or claim processing.",
        ]
    elif "passport" in lowered_name:
        document_type = "Passport"
        claim_related = False
        confidence = 0.95
        summary = [
            "Passport document detected.",
            "Useful for identity verification.",
            "May be requested for profile validation.",
        ]
    else:
        document_type = "Unknown"
        claim_related = False
        confidence = 0.62
        summary = [
            "Document type is unclear from the filename.",
            "The file was received successfully.",
            "Manual review can confirm the right category.",
        ]

    if "image" in lowered_type or lowered_type.endswith(("png", "jpg", "jpeg")):
        summary.append("Image-based document detected.")

    return {
        "document_type": document_type,
        "claim_related": claim_related,
        "confidence": round(confidence * 100),
        "summary": summary[:5],
    }


@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    allowed = {".pdf", ".png", ".jpg", ".jpeg"}

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, JPG, JPEG and PNG files are allowed."
        )

    destination = UPLOAD_DIR / file.filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    analysis = analyze_document(file.filename, file.content_type)

    return {
        "success": True,
        "filename": file.filename,
        "size": destination.stat().st_size,
        "path": str(destination),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
        **analysis,
    }
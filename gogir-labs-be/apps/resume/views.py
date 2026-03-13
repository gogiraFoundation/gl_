from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from .models import Experience, Education, Certification, Skill
from .serializers import (
    ExperienceSerializer,
    EducationSerializer,
    CertificationSerializer,
    SkillSerializer,
)


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing Experience instances."""

    queryset = Experience.objects.all().order_by("-order", "-start_date", "-is_current")
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing Education instances."""

    queryset = Education.objects.all().order_by("-order", "-start_date", "-is_current")
    serializer_class = EducationSerializer
    permission_classes = [AllowAny]


class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing Certification instances."""

    queryset = Certification.objects.all().order_by("-order", "-issue_date")
    serializer_class = CertificationSerializer
    permission_classes = [AllowAny]


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing Skill instances."""

    queryset = Skill.objects.all().order_by("category", "order", "name")
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


def download_resume_pdf(request):
    """Generate and download resume as PDF."""
    from io import BytesIO

    # Get all resume data
    experience = Experience.objects.all().order_by("-order", "-start_date")
    education = Education.objects.all().order_by("-order", "-start_date")
    certifications = Certification.objects.all().order_by("-order", "-issue_date")
    skills = Skill.objects.all().order_by("category", "order", "name")

    # Create PDF in memory
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter, topMargin=0.5 * inch, bottomMargin=0.5 * inch
    )
    story = []

    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=colors.HexColor("#7c3aed"),
        spaceAfter=12,
        alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        "CustomHeading",
        parent=styles["Heading2"],
        fontSize=16,
        textColor=colors.HexColor("#7c3aed"),
        spaceAfter=6,
        spaceBefore=12,
    )
    normal_style = styles["Normal"]
    normal_style.fontSize = 10
    normal_style.leading = 14

    # Header
    story.append(Paragraph("Emmanuel Ugbaje", title_style))
    story.append(
        Paragraph(
            "Software Engineer | Building Solutions with Data Insights",
            ParagraphStyle(
                "Subtitle", parent=normal_style, alignment=TA_CENTER, fontSize=12
            ),
        )
    )
    story.append(Spacer(1, 0.3 * inch))

    # Experience
    if experience.exists():
        story.append(Paragraph("EXPERIENCE", heading_style))
        for exp in experience:
            # Title and Company
            title_text = f"<b>{exp.title}</b> - {exp.company}"
            if exp.location:
                title_text += f" | {exp.location}"
            story.append(Paragraph(title_text, normal_style))

            # Date range
            from django.utils import timezone

            start_date = exp.start_date.strftime("%B %Y")
            if exp.is_current:
                end_date = "Present"
            elif exp.end_date:
                end_date = exp.end_date.strftime("%B %Y")
            else:
                end_date = "Present"
            story.append(Paragraph(f"<i>{start_date} - {end_date}</i>", normal_style))

            # Description
            if exp.description:
                story.append(
                    Paragraph(exp.description.replace("\n", "<br/>"), normal_style)
                )

            # Technologies
            if exp.technologies:
                tech_text = f"<b>Technologies:</b> {exp.technologies}"
                story.append(Paragraph(tech_text, normal_style))

            story.append(Spacer(1, 0.2 * inch))

    # Education
    if education.exists():
        story.append(PageBreak())
        story.append(Paragraph("EDUCATION", heading_style))
        for edu in education:
            story.append(Paragraph(f"<b>{edu.degree}</b>", normal_style))
            story.append(Paragraph(edu.institution, normal_style))
            if edu.field_of_study:
                story.append(Paragraph(edu.field_of_study, normal_style))
            if edu.gpa:
                story.append(Paragraph(f"GPA: {edu.gpa}", normal_style))
            if edu.description:
                story.append(
                    Paragraph(edu.description.replace("\n", "<br/>"), normal_style)
                )
            story.append(Spacer(1, 0.2 * inch))

    # Certifications
    if certifications.exists():
        story.append(PageBreak())
        story.append(Paragraph("CERTIFICATIONS", heading_style))
        for cert in certifications:
            story.append(Paragraph(f"<b>{cert.name}</b>", normal_style))
            story.append(Paragraph(cert.issuer, normal_style))
            if cert.issue_date:
                issue_date = cert.issue_date.strftime("%B %Y")
                if cert.expiry_date:
                    expiry_date = cert.expiry_date.strftime("%B %Y")
                    story.append(
                        Paragraph(
                            f"Issued: {issue_date} | Expires: {expiry_date}",
                            normal_style,
                        )
                    )
                else:
                    story.append(Paragraph(f"Issued: {issue_date}", normal_style))
            if cert.credential_id:
                story.append(
                    Paragraph(f"Credential ID: {cert.credential_id}", normal_style)
                )
            story.append(Spacer(1, 0.2 * inch))

    # Skills
    if skills.exists():
        story.append(PageBreak())
        story.append(Paragraph("SKILLS", heading_style))

        # Group skills by category
        skills_by_category = {}
        for skill in skills:
            category = (
                skill.get_category_display()
                if hasattr(skill, "get_category_display")
                else skill.category.replace("_", " ").title()
            )
            if category not in skills_by_category:
                skills_by_category[category] = []
            skills_by_category[category].append(skill)

        for category, category_skills in skills_by_category.items():
            story.append(Paragraph(f"<b>{category}:</b>", normal_style))
            skill_names = [f"{s.name} ({s.proficiency}/10)" for s in category_skills]
            story.append(Paragraph(", ".join(skill_names), normal_style))
            story.append(Spacer(1, 0.15 * inch))

    # Build PDF
    doc.build(story)

    # Get PDF content
    pdf_content = buffer.getvalue()
    buffer.close()

    # Create HTTP response
    response = HttpResponse(pdf_content, content_type="application/pdf")
    response["Content-Disposition"] = (
        'attachment; filename="Emmanuel_Ugbaje_Resume.pdf"'
    )
    return response

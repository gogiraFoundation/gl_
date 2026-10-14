import html
from io import BytesIO

from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.site.models import SiteProfile

from .models import Certification, Education, Experience, Skill
from .serializers import (
    CertificationSerializer,
    EducationSerializer,
    ExperienceSerializer,
    SkillSerializer,
)


def _escape_pdf(text: str) -> str:
    """Escape user text for ReportLab Paragraph (XML-ish markup)."""
    return html.escape(text or "", quote=False)


def _bullet_lines(highlights, description: str) -> list[str]:
    if isinstance(highlights, list) and highlights:
        return [
            _escape_pdf(str(item))
            for item in highlights
            if str(item).strip()
        ]
    if description:
        return [
            _escape_pdf(line.strip())
            for line in description.splitlines()
            if line.strip()
        ]
    return []


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


class ResumeAggregateView(APIView):
    """Return all resume sections in one payload."""

    permission_classes = [AllowAny]

    def get(self, request):
        ctx = {"request": request}
        experience = Experience.objects.all().order_by(
            "-order", "-start_date", "-is_current"
        )
        education = Education.objects.all().order_by(
            "-order", "-start_date", "-is_current"
        )
        certifications = Certification.objects.all().order_by("-order", "-issue_date")
        skills = Skill.objects.all().order_by("category", "order", "name")
        return Response(
            {
                "experience": ExperienceSerializer(
                    experience, many=True, context=ctx
                ).data,
                "education": EducationSerializer(
                    education, many=True, context=ctx
                ).data,
                "certifications": CertificationSerializer(
                    certifications, many=True, context=ctx
                ).data,
                "skills": SkillSerializer(skills, many=True, context=ctx).data,
            },
            status=status.HTTP_200_OK,
        )


def download_resume_pdf(request):
    """Generate and download resume as PDF."""
    profile = SiteProfile.load()
    full_name = profile.display_name
    headline = profile.headline or "Software Engineer | Building Solutions with Data Insights"

    experience = Experience.objects.all().order_by("-order", "-start_date")
    education = Education.objects.all().order_by("-order", "-start_date")
    certifications = Certification.objects.all().order_by("-order", "-issue_date")
    skills = Skill.objects.all().order_by("category", "order", "name")

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter, topMargin=0.5 * inch, bottomMargin=0.5 * inch
    )
    story = []

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

    story.append(Paragraph(_escape_pdf(full_name), title_style))
    story.append(
        Paragraph(
            _escape_pdf(headline),
            ParagraphStyle(
                "Subtitle", parent=normal_style, alignment=TA_CENTER, fontSize=12
            ),
        )
    )
    story.append(Spacer(1, 0.3 * inch))

    if experience.exists():
        story.append(Paragraph("EXPERIENCE", heading_style))
        for exp in experience:
            title_text = (
                f"<b>{_escape_pdf(exp.title)}</b> - {_escape_pdf(exp.company)}"
            )
            if exp.location:
                title_text += f" | {_escape_pdf(exp.location)}"
            story.append(Paragraph(title_text, normal_style))

            start_date = exp.start_date.strftime("%B %Y")
            if exp.is_current:
                end_date = "Present"
            elif exp.end_date:
                end_date = exp.end_date.strftime("%B %Y")
            else:
                end_date = "Present"
            story.append(Paragraph(f"<i>{start_date} - {end_date}</i>", normal_style))

            for line in _bullet_lines(exp.highlights, exp.description):
                story.append(Paragraph(f"• {line}", normal_style))

            if exp.technologies:
                story.append(
                    Paragraph(
                        f"<b>Technologies:</b> {_escape_pdf(exp.technologies)}",
                        normal_style,
                    )
                )

            story.append(Spacer(1, 0.2 * inch))

    if education.exists():
        story.append(PageBreak())
        story.append(Paragraph("EDUCATION", heading_style))
        for edu in education:
            story.append(Paragraph(f"<b>{_escape_pdf(edu.degree)}</b>", normal_style))
            story.append(Paragraph(_escape_pdf(edu.institution), normal_style))
            if edu.field_of_study:
                story.append(Paragraph(_escape_pdf(edu.field_of_study), normal_style))
            if edu.gpa:
                story.append(Paragraph(f"GPA: {_escape_pdf(str(edu.gpa))}", normal_style))
            for line in _bullet_lines(edu.highlights, edu.description):
                story.append(Paragraph(f"• {line}", normal_style))
            story.append(Spacer(1, 0.2 * inch))

    if certifications.exists():
        story.append(PageBreak())
        story.append(Paragraph("CERTIFICATIONS", heading_style))
        for cert in certifications:
            story.append(Paragraph(f"<b>{_escape_pdf(cert.name)}</b>", normal_style))
            story.append(Paragraph(_escape_pdf(cert.issuer), normal_style))
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
                    Paragraph(
                        f"Credential ID: {_escape_pdf(cert.credential_id)}",
                        normal_style,
                    )
                )
            story.append(Spacer(1, 0.2 * inch))

    if skills.exists():
        story.append(PageBreak())
        story.append(Paragraph("SKILLS", heading_style))
        skills_by_category: dict[str, list] = {}
        for skill in skills:
            category = skill.get_category_display()
            skills_by_category.setdefault(category, []).append(skill)

        for category, category_skills in skills_by_category.items():
            story.append(Paragraph(f"<b>{_escape_pdf(category)}:</b>", normal_style))
            skill_names = []
            for s in category_skills:
                if s.proficiency is not None:
                    skill_names.append(
                        f"{_escape_pdf(s.name)} ({s.proficiency}/10)"
                    )
                else:
                    skill_names.append(_escape_pdf(s.name))
            story.append(Paragraph(", ".join(skill_names), normal_style))
            story.append(Spacer(1, 0.15 * inch))

    doc.build(story)
    pdf_content = buffer.getvalue()
    buffer.close()

    filename = f"{full_name.replace(' ', '_')}_Resume.pdf"
    response = HttpResponse(pdf_content, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response

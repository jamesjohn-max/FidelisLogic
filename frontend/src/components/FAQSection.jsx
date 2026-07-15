import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

// Visible FAQ accordion section. Pair with <FAQSchema faqs={faqs} /> for SEO.
export const FAQSection = ({
  faqs,
  title = "Frequently Asked Questions",
  subtitle,
  testIdPrefix = "faq"
}) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white" data-testid={`${testIdPrefix}-section`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold text-brand-dark mb-4"
            data-testid={`${testIdPrefix}-title`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          data-testid={`${testIdPrefix}-accordion`}
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-200"
              data-testid={`${testIdPrefix}-item-${index}`}
            >
              <AccordionTrigger
                className="text-left text-lg font-semibold text-brand-dark hover:text-brand-red py-5"
                data-testid={`${testIdPrefix}-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="text-base text-gray-700 leading-relaxed pb-5"
                data-testid={`${testIdPrefix}-answer-${index}`}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
